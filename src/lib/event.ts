export function publish<T extends object>(name: string, args?: T) {
  if (!args) args = {} as T;

  const event = new CustomEvent(name, { detail: { name, ...args } });
  document.dispatchEvent(event);
}

export function subscribe(name: string, callback: (args: Event) => void) {
  document.addEventListener(name, (e) => callback(e));
}
