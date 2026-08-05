export function step(message) {
  console.log(`- ${message}`);
}

export function pass(message) {
  console.log(`OK ${message}`);
}

export function fail(message) {
  console.error(`FAIL ${message}`);
}
