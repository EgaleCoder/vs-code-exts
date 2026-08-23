/**
 * Motivational and humorous developer quotes delivered by EgaleCoder
 */

export const EAGLE_QUOTES: string[] = [
  "🦅 *SCREEECH!* 'Soar high above your compiler errors!'",
  "🦅 'An eagle does not escape the storm; it uses the wind to soar higher. Refactor that code!'",
  "🦅 'Spot bugs from 10,000 feet before they even hit production!'",
  "🦅 *FLAP FLAP* 'Git commit often, push fearlessly, soar majestically!'",
  "🦅 'Eyes sharp as talons: no memory leak escapes EgaleCoder!'",
  "🦅 'Zero merge conflicts spotted in your air space. Keep flying!'",
  "🦅 *SCREEECH!* 'Typed code is high-altitude code. Clean TypeScript detected!'",
  "🦅 'Your algorithms have supersonic lift today!'",
  "🦅 'Fly through your pull requests like a raptor catching thermal updrafts!'",
  "🦅 'Clean architecture is like a high mountain eyrie: unshakeable!'",
  "🦅 *SCREEECH!* 'Caught a syntax bug in mid-air! You are safe now.'",
  "🦅 'Even the fiercest eagle rests its wings. Hydrate and stretch!'",
  "🦅 'May your builds be swift and your tests always green!'",
  "🦅 'From up here, all legacy code looks conquerable!'",
  "🦅 *WHOOSH!* 'Eagle Eye engaged! Code patrol cruising at maximum velocity.'"
];

export function getRandomEagleQuote(): string {
  const index = Math.floor(Math.random() * EAGLE_QUOTES.length);
  return EAGLE_QUOTES[index];
}
