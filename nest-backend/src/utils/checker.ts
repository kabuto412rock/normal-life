export function integerCheckFormater(value, minValue, maxValue) {
  let v = parseInt(value);

  if (isNaN(v)) {
    throw new Error(value + ' should be a integer');
  } else if (maxValue !== undefined && v > maxValue) {
    v = maxValue;
  } else if (minValue !== undefined && v < minValue) {
    v = minValue;
  }
  return v;
}
