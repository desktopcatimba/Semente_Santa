const PRICE_PER_BLOCK_0_11 = 6250; // por cada bloco de 25 crianças (0-11 anos)
const CHILDREN_PER_BLOCK = 25;
const PRICE_PER_PERSON_12_PLUS = 265; // por cada pessoa a partir dos 12 anos

export function calculateMuseumCost(count0to11: number, count12plus: number) {
  const blocks0to11 = Math.ceil(count0to11 / CHILDREN_PER_BLOCK);
  const cost0to11 = count0to11 === 0 ? 0 : blocks0to11 * PRICE_PER_BLOCK_0_11;
  const cost12plus = count12plus * PRICE_PER_PERSON_12_PLUS;

  return {
    count0to11,
    count12plus,
    blocks0to11,
    cost0to11,
    cost12plus,
    total: cost0to11 + cost12plus,
  };
}
