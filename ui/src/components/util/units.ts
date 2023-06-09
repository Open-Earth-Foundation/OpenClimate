export function readableEmissions(value: number, type?: string) {
  if (value < 500) {
    return type === "array" ? [`${value}`, "T"] : `${value}T`;
  } else if (value < 500000) {
    return type === "array"
      ? [`${(value / 1000.0).toPrecision(3)}`, "Kt"]
      : `${(value / 1000.0).toPrecision(3)}kT`;
  } else if (value < 500000000) {
    return type === "array"
      ? [`${(value / 1000000.0).toPrecision(3)}`, "Mt"]
      : `${(value / 1000000.0).toPrecision(3)}MT`;
  } else {
    return type === "array"
      ? [`${(value / 1000000000.0).toPrecision(3)}`, "Gt"]
      : `${(value / 1000000000.0).toPrecision(3)}GT`;
  }
}

export function readablePercentagePopulation(current: number, parent: number) {
  const precisePercentage: number = parseFloat(
    ((current / parent) * 100).toPrecision(3)
  );
  return precisePercentage / 1;
}

// convert to giga tonnes
export function convertToGigaTonnes(value: number, type?: string) {
  return type === "array"
  ? [`${(value / 1000000000.0).toPrecision(3)}`, "Gt"]
  : `${(value / 1000000000.0).toPrecision(3)}GT`;
}
