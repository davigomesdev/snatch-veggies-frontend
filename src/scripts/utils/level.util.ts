export const getLevel = (exp: number): number => {
  const maxLevel = 10;
  let totalExp = 100;

  for (let level = 1; level <= maxLevel; level++) {
    if (exp < totalExp) {
      return level;
    }

    totalExp += Math.floor(totalExp * 2);
  }

  return maxLevel;
};

export const getProgressToNextLevel = (exp: number): number => {
  let totalExp = 100;
  let prevTotalExp = 0;

  for (let level = 1; level <= 10; level++) {
    if (exp < totalExp) {
      return ((exp - prevTotalExp) / (totalExp - prevTotalExp)) * 100;
    }

    prevTotalExp = totalExp;
    totalExp += Math.floor(totalExp * 2);
  }

  return 100;
};

export function calculateMaxQuantity(limit: number, exp: number): number {
  const maxLevel = 10;
  return Math.max(1, Math.floor((getLevel(exp) / maxLevel) * limit));
}
