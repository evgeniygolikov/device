export default function isEnterKey({key, keyCode}) {
  return key === 'Enter' || keyCode === 13;
}