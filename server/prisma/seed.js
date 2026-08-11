import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entitiesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../src/data/entities.json'), 'utf-8')
);
const attributesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../src/data/attributes.json'), 'utf-8')
);

const prisma = new PrismaClient();

const formatAttributeValue = (val, type, unit) => {
  if (val === undefined || val === null) return 'N/A';
  if (type === 'year') return val.toString();
  if (type === 'currency') {
    if (val >= 1000000000000) return `$${(val / 1000000000000).toFixed(2)} Trillion`;
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)} Billion`;
    if (val >= 1000000) return `$${Math.round(val / 1000000)} Million`;
    return `$${val.toLocaleString()}`;
  }
  if (val >= 1000000000) return `${(val / 1000000000).toFixed(2)} Billion`;
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)} Million`;
  if (val >= 1000) return `${val.toLocaleString()} ${unit || ''}`.trim();
  return `${val} ${unit || ''}`.trim();
};

async function main() {
  console.log('🌱 Seeding PLAY STILL ALIVE database in Supabase...');

  // Clear existing records safely
  await prisma.answerAttempt.deleteMany();
  await prisma.gameSession.deleteMany();
  await prisma.question.deleteMany();

  const questionsToCreate = [];
  const attributeKeys = Object.keys(attributesData);

  for (const attrKey of attributeKeys) {
    const attrMeta = attributesData[attrKey];
    const eligibleEntities = entitiesData.filter(
      (e) => e.attributes && e.attributes[attrKey] !== undefined && e.attributes[attrKey] !== null
    );

    if (eligibleEntities.length >= 2) {
      for (let i = 0; i < eligibleEntities.length - 1; i++) {
        for (let j = i + 1; j < eligibleEntities.length; j++) {
          const entityA = eligibleEntities[i];
          const entityB = eligibleEntities[j];
          const valA = entityA.attributes[attrKey];
          const valB = entityB.attributes[attrKey];

          if (valA === valB) continue;

          const displayA = formatAttributeValue(valA, attrMeta.type, attrMeta.unit);
          const displayB = formatAttributeValue(valB, attrMeta.type, attrMeta.unit);
          const phrasing = attrMeta.phrasings[Math.floor(Math.random() * attrMeta.phrasings.length)];

          // PICK_WINNER Question
          questionsToCreate.push({
            category: entityA.category,
            formatType: 'PICK_WINNER',
            metric: attrMeta.name,
            entityA: entityA.name,
            entityB: entityB.name,
            valueA: valA,
            valueB: valB,
            displayA,
            displayB,
            prompt: phrasing,
            dataAsOf: 'August 2026',
          });

          // TIMELINE Question if type is year
          if (attrMeta.type === 'year') {
            questionsToCreate.push({
              category: entityA.category,
              formatType: 'TIMELINE',
              metric: attrMeta.name,
              entityA: entityA.name,
              entityB: entityB.name,
              valueA: valA,
              valueB: valB,
              displayA: valA.toString(),
              displayB: valB.toString(),
              prompt: 'Which was founded or released EARLIER?',
              dataAsOf: 'August 2026',
            });
          }
        }
      }
    }
  }

  console.log(`📦 Generated ${questionsToCreate.length} questions from entity graph.`);

  // Batch insert into Prisma
  await prisma.question.createMany({
    data: questionsToCreate,
  });

  console.log('✅ Supabase database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
