export default function isSpaceKey({key, keyCode}) {
  return key === ' ' || keyCode === 27;
}