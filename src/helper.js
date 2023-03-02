export function randomRgba() {
  function getRandom() {
    return Math.floor(Math.random() * 255);
  }

  return `rgba(${getRandom()},${getRandom()},${getRandom()},0.4)`;
}
