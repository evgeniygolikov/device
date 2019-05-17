export default function isEscapeKey({key, keyCode}) {
  return key === 'Esc' || key === 'Escape' || keyCode === 27;
}