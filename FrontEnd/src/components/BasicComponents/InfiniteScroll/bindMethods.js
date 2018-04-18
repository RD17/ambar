export function bindMethods(component, names) {
  if(typeof names === 'string') {
    names = [names];
  }
  names.forEach((name) =>
      component[name] = component[name].bind(component)
  );
}