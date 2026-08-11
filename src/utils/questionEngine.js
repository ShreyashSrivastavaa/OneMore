import entitiesData from '../data/entities.json';
import attributesData from '../data/attributes.json';
import questionsData from '../data/questions.json';

export const ROUND_FORMATS = {
  PICK_WINNER: 'PICK_WINNER',
  OVER_UNDER: 'OVER_UNDER',
  TIMELINE: 'TIMELINE',
};

// Session history memory to prevent repeats
const recentPairKeys = new Set();
let lastEntityId = null;

// Format numbers into human-friendly strings ($3.4 Trillion, 635 Million, 8,849 m)
export const formatAttributeValue = (val, type, unit) => {
  if (val === undefined || val === null) return 'N/A';

  if (type === 'year') {
    return val.toString();
  }

  if (type === 'currency') {
    if (val >= 1000000000000) {
      return `$${(val / 1000000000000).toFixed(2)} Trillion`;
    }
    if (val >= 1000000000) {
      return `$${(val / 1000000000).toFixed(2)} Billion`;
    }
    if (val >= 1000000) {
      return `$${Math.round(val / 1000000)} Million`;
    }
    return `$${val.toLocaleString()}`;
  }

  if (type === 'count' || type === 'area' || type === 'length' || type === 'speed' || type === 'weight') {
    if (val >= 1000000000) {
      return `${(val / 1000000000).toFixed(2)} Billion`;
    }
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)} Million`;
    }
    if (val >= 1000) {
      return `${val.toLocaleString()} ${unit || ''}`.trim();
    }
    return `${val} ${unit || ''}`.trim();
  }

  return val.toLocaleString();
};

// Determine difficulty tier based on streak
const getTargetDifficultyTier = (streak) => {
  if (streak >= 15) return 'Hard';
  if (streak >= 6) return 'Medium';
  return 'Easy';
};

// Main Dynamic Question Generator
export const generateDynamicQuestion = (streak = 0) => {
  const targetTier = getTargetDifficultyTier(streak);
  const roundFormatIndex = streak % 3;

  // Try dynamic relational engine first
  const attributeKeys = Object.keys(attributesData);
  const shuffledAttributes = [...attributeKeys].sort(() => Math.random() - 0.5);

  for (const attrKey of shuffledAttributes) {
    const attrMeta = attributesData[attrKey];
    
    // Find all entities with valid non-null numerical values for this attribute
    const eligibleEntities = entitiesData.filter(
      (e) => e.attributes && e.attributes[attrKey] !== undefined && e.attributes[attrKey] !== null
    );

    if (eligibleEntities.length >= 2) {
      // Pick Entity A and Entity B
      const shuffledEntities = [...eligibleEntities].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < shuffledEntities.length - 1; i++) {
        for (let j = i + 1; j < shuffledEntities.length; j++) {
          const entityA = shuffledEntities[i];
          const entityB = shuffledEntities[j];

          // Avoid showing same entity in consecutive rounds
          if (entityA.id === lastEntityId || entityB.id === lastEntityId) continue;

          const pairKey = `${entityA.id}-${entityB.id}-${attrKey}`;
          if (recentPairKeys.has(pairKey)) continue;

          const valA = entityA.attributes[attrKey];
          const valB = entityB.attributes[attrKey];
          if (valA === valB) continue;

          const ratio = Math.min(valA, valB) / Math.max(valA, valB);
          
          let pairDifficulty = 'Easy';
          if (ratio >= 0.82) pairDifficulty = 'Hard';
          else if (ratio >= 0.6) pairDifficulty = 'Medium';

          // Match streak difficulty tier requirement when possible
          if (targetTier === 'Hard' && pairDifficulty === 'Easy') continue;
          if (targetTier === 'Easy' && pairDifficulty === 'Hard') continue;

          // Track session memory
          recentPairKeys.add(pairKey);
          if (recentPairKeys.size > 20) {
            const first = recentPairKeys.values().next().value;
            recentPairKeys.delete(first);
          }
          lastEntityId = entityA.id;

          // Determine format type
          let formatType = ROUND_FORMATS.PICK_WINNER;
          if (roundFormatIndex === 1) {
            formatType = ROUND_FORMATS.OVER_UNDER;
          } else if (roundFormatIndex === 2 && attrMeta.type === 'year') {
            formatType = ROUND_FORMATS.TIMELINE;
          }

          const displayA = formatAttributeValue(valA, attrMeta.type, attrMeta.unit);
          const displayB = formatAttributeValue(valB, attrMeta.type, attrMeta.unit);

          // Build phrasing
          const phrasing = attrMeta.phrasings[Math.floor(Math.random() * attrMeta.phrasings.length)];

          if (formatType === ROUND_FORMATS.OVER_UNDER) {
            const multiplier = Math.random() < 0.5 ? 1.25 : 0.75;
            const targetVal = Math.round(valA * multiplier);
            const targetDisplay = formatAttributeValue(targetVal, attrMeta.type, attrMeta.unit);
            const isOver = valA >= targetVal;

            return {
              id: `${entityA.id}_${attrKey}_${Date.now()}`,
              formatType: ROUND_FORMATS.OVER_UNDER,
              category: entityA.category,
              metric: attrMeta.name,
              entityA: entityA.name,
              valueA: valA,
              displayA,
              targetValue: targetVal,
              targetDisplay,
              isOver,
              prompt: `Does ${entityA.name} have OVER or UNDER ${targetDisplay} ${attrMeta.name.toLowerCase()}?`,
            };
          }

          if (formatType === ROUND_FORMATS.TIMELINE) {
            const aIsEarlier = valA <= valB;
            return {
              id: `${entityA.id}_vs_${entityB.id}_${Date.now()}`,
              formatType: ROUND_FORMATS.TIMELINE,
              category: entityA.category,
              entityA: entityA.name,
              entityB: entityB.name,
              yearA: valA,
              yearB: valB,
              displayA: valA.toString(),
              displayB: valB.toString(),
              aIsEarlier,
              prompt: `Which was founded or released EARLIER?`,
            };
          }

          // PICK_WINNER
          const aIsBigger = valA >= valB;
          return {
            id: `${entityA.id}_vs_${entityB.id}_${Date.now()}`,
            formatType: ROUND_FORMATS.PICK_WINNER,
            category: entityA.category,
            metric: attrMeta.name,
            entityA: entityA.name,
            entityB: entityB.name,
            valueA: valA,
            valueB: valB,
            displayA,
            displayB,
            aIsBigger,
            prompt: phrasing,
          };
        }
      }
    }
  }

  // Fallback to questions.json if relational lookup is exhausted
  const randomIndex = Math.floor(Math.random() * questionsData.length);
  const rawFallback = questionsData[randomIndex];
  const swap = Math.random() < 0.5;

  return {
    id: `fallback_${rawFallback.id}_${Date.now()}`,
    formatType: ROUND_FORMATS.PICK_WINNER,
    category: rawFallback.category,
    metric: rawFallback.metric,
    entityA: swap ? rawFallback.entityB : rawFallback.entityA,
    entityB: swap ? rawFallback.entityA : rawFallback.entityB,
    valueA: swap ? rawFallback.valueB : rawFallback.valueA,
    valueB: swap ? rawFallback.valueA : rawFallback.valueB,
    displayA: swap ? rawFallback.displayB : rawFallback.displayA,
    displayB: swap ? rawFallback.displayA : rawFallback.displayB,
    aIsBigger: (swap ? rawFallback.valueB : rawFallback.valueA) >= (swap ? rawFallback.valueA : rawFallback.valueB),
    prompt: `Which has MORE ${rawFallback.metric.toLowerCase()}?`,
  };
};
