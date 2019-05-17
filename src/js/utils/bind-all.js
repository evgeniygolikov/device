export default function bindAll(context, keys) {
  keys.forEach(key => {
    context[key] = context[key].bind(context);
  });
}