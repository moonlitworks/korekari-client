export const normalPlayerDamage = (monster, player) => {
  const baseDamage = 1 + standardDamage(1, player?.weapon?.strength ?? 0);
  const monsterDefense = standardDamage(1, monster?.level ?? 0);
  return Math.max(1, Math.round(baseDamage - monsterDefense));
}

export const normalMonsterDamage = (monster, player) => {
  const baseDamage = 1 + standardDamage(5, monster?.level ?? 0);
  const playerDefense = standardDamage(3, player?.armor?.strength ?? 0);
  return Math.max(1, Math.round(baseDamage - playerDefense));
}

export const standardDamage = (multiplier, modifier) =>
  multiplier * (1 + (0.2 * modifier))
