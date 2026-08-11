import entitiesData from '../data/entities.json';
import attributesData from '../data/attributes.json';
import questionsData from '../data/questions.json';

export const ROUND_FORMATS = {
  PICK_WINNER: 'PICK_WINNER',
  OVER_UNDER: 'OVER_UNDER',
  TIMELINE: 'TIMELINE',
};

const recentPairKeys = new Set();
let lastEntityId = null;

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

const getTargetDifficultyTier = (streak) => {
  if (streak >= 15) return 'Hard';
  if (streak >= 6) return 'Medium';
  return 'Easy';
};

export const generateDynamicQuestion = (streak = 0) => {
  const targetTier = getTargetDifficultyTier(streak);
  const roundFormatIndex = streak % 3;
  const defaultAsOf = 'August 2026';

  const attributeKeys = Object.keys(attributesData);
  const shuffledAttributes = [...attributeKeys].sort(() => Math.random() - 0.5);

  for (const attrKey of shuffledAttributes) {
    const attrMeta = attributesData[attrKey];
    
    const eligibleEntities = entitiesData.filter(
      (e) => e.attributes && e.attributes[attrKey] !== undefined && e.attributes[attrKey] !== null
    );

    if (eligibleEntities.length >= 2) {
      const shuffledEntities = [...eligibleEntities].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < shuffledEntities.length - 1; i++) {
        for (let j = i + 1; j < shuffledEntities.length; j++) {
          const entityA = shuffledEntities[i];
          const entityB = shuffledEntities[j];

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

          if (targetTier === 'Hard' && pairDifficulty === 'Easy') continue;
          if (targetTier === 'Easy' && pairDifficulty === 'Hard') continue;

          recentPairKeys.add(pairKey);
          if (recentPairKeys.size > 20) {
            const first = recentPairKeys.values().next().value;
            recentPairKeys.delete(first);
          }
          lastEntityId = entityA.id;

          let formatType = ROUND_FORMATS.PICK_WINNER;
          if (roundFormatIndex === 1) {
            formatType = ROUND_FORMATS.OVER_UNDER;
          } else if (roundFormatIndex === 2 && attrMeta.type === 'year') {
            formatType = ROUND_FORMATS.TIMELINE;
          }

          const displayA = formatAttributeValue(valA, attrMeta.type, attrMeta.unit);
          const displayB = formatAttributeValue(valB, attrMeta.type, attrMeta.unit);
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
              dataAsOf: defaultAsOf,
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
              dataAsOf: defaultAsOf,
              prompt: `Which was founded or released EARLIER?`,
            };
          }

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
            dataAsOf: defaultAsOf,
            prompt: phrasing,
          };
        }
      }
    }
  }

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
    dataAsOf: 'August 2026',
    prompt: `Which has MORE ${rawFallback.metric.toLowerCase()}?`,
  };
};
