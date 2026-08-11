// Helper to format raw comparison questions into 3 dynamic round types

export const ROUND_FORMATS = {
  PICK_WINNER: 'PICK_WINNER',
  OVER_UNDER: 'OVER_UNDER',
  TIMELINE: 'TIMELINE',
};

// Timeline years database for entities
const TIMELINE_YEARS = {
  Microsoft: 1975,
  Apple: 1976,
  Amazon: 1994,
  Google: 1998,
  Tesla: 2003,
  Facebook: 2004,
  'Meta (Facebook)': 2004,
  YouTube: 2005,
  Spotify: 2006,
  Netflix: 1997,
  Uber: 2009,
  Airbnb: 2008,
  SpaceX: 2002,
  'Blue Origin': 2000,
  Sony: 1946,
  Samsung: 1938,
  Nintendo: 1889,
  Ferrari: 1939,
  Porsche: 1931,
  Starbucks: 1971,
  "McDonald's": 1940,
  Subway: 1965,
  Nike: 1964,
  Adidas: 1949,

  'Titanic (1997)': 1997,
  'Avatar (2009)': 2009,
  'Avengers: Endgame': 2019,
  'Star Wars: The Force Awakens': 2015,
  'Barbie (2023)': 2023,
  'Oppenheimer (2023)': 2023,
  'The Dark Knight (2008)': 2008,
  'Joker (2019)': 2019,
  'Spider-Man: No Way Home': 2021,
  'Top Gun: Maverick': 2022,
  'Inception (2010)': 2010,
  'Fast & Furious 7': 2015,

  Tetris: 1984,
  'Super Mario Bros.': 1985,
  Minecraft: 2011,
  'Grand Theft Auto V': 2013,
  'Red Dead Redemption 2': 2018,
  'Elden Ring': 2022,
  Roblox: 2006,
  'Cyberpunk 2077': 2020,
  Skyrim: 2011,
  'Diablo IV': 2023,
  Starfield: 2023,
};

export const generateRoundData = (rawQuestion, streak) => {
  const formatIndex = streak % 3;
  let formatType = ROUND_FORMATS.PICK_WINNER;

  if (formatIndex === 1) {
    formatType = ROUND_FORMATS.OVER_UNDER;
  } else if (formatIndex === 2) {
    if (TIMELINE_YEARS[rawQuestion.entityA] && TIMELINE_YEARS[rawQuestion.entityB]) {
      formatType = ROUND_FORMATS.TIMELINE;
    } else {
      formatType = ROUND_FORMATS.PICK_WINNER;
    }
  }

  const swap = Math.random() < 0.5;
  const entityA = swap ? rawQuestion.entityB : rawQuestion.entityA;
  const entityB = swap ? rawQuestion.entityA : rawQuestion.entityB;
  const valueA = swap ? rawQuestion.valueB : rawQuestion.valueA;
  const valueB = swap ? rawQuestion.valueA : rawQuestion.valueB;
  const displayA = swap ? rawQuestion.displayB : rawQuestion.displayA;
  const displayB = swap ? rawQuestion.displayA : rawQuestion.displayB;

  if (formatType === ROUND_FORMATS.OVER_UNDER) {
    const multiplier = Math.random() < 0.5 ? 1.25 : 0.75;
    const rawTarget = Math.round(valueA * multiplier);
    
    let targetDisplay = rawTarget.toLocaleString();
    if (rawTarget >= 1000000000) {
      targetDisplay = (rawTarget / 1000000000).toFixed(1) + ' Billion';
    } else if (rawTarget >= 1000000) {
      targetDisplay = Math.round(rawTarget / 1000000) + ' Million';
    }

    const isOver = valueA >= rawTarget;

    // Natural prompt wording
    let actionWord = 'have';
    const categoryLower = rawQuestion.category.toLowerCase();
    if (categoryLower === 'gaming' || categoryLower === 'movies') {
      actionWord = 'reach / sell';
    } else if (categoryLower === 'geography') {
      actionWord = 'have';
    }

    return {
      id: rawQuestion.id,
      formatType: ROUND_FORMATS.OVER_UNDER,
      category: rawQuestion.category,
      metric: rawQuestion.metric,
      entityA,
      valueA,
      displayA,
      targetValue: rawTarget,
      targetDisplay,
      isOver,
      prompt: `Does ${entityA} ${actionWord} OVER or UNDER ${targetDisplay} ${rawQuestion.metric.toLowerCase()}?`,
    };
  }

  if (formatType === ROUND_FORMATS.TIMELINE) {
    const yearA = TIMELINE_YEARS[entityA] || 2000;
    const yearB = TIMELINE_YEARS[entityB] || 2005;
    const aIsEarlier = yearA <= yearB;

    return {
      id: rawQuestion.id,
      formatType: ROUND_FORMATS.TIMELINE,
      category: rawQuestion.category,
      entityA,
      entityB,
      yearA,
      yearB,
      displayA: yearA.toString(),
      displayB: yearB.toString(),
      aIsEarlier,
      prompt: `Which was founded or released EARLIER?`,
    };
  }

  const aIsBigger = valueA >= valueB;

  return {
    id: rawQuestion.id,
    formatType: ROUND_FORMATS.PICK_WINNER,
    category: rawQuestion.category,
    metric: rawQuestion.metric,
    entityA,
    entityB,
    valueA,
    valueB,
    displayA,
    displayB,
    aIsBigger,
    prompt: `Which has MORE ${rawQuestion.metric.toLowerCase()}?`,
  };
};
