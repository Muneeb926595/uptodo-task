type Listener = (...args: any[]) => void;

const listeners: Map<string, Set<Listener>> = new Map();

export const on = (event: string, cb: Listener) => {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event)!.add(cb);
  return () => off(event, cb);
};

export const off = (event: string, cb?: Listener) => {
  if (!listeners.has(event)) return;
  if (!cb) {
    listeners.delete(event);
    return;
  }
  listeners.get(event)!.delete(cb);
};

export const emit = (event: string, ...args: any[]) => {
  const set = listeners.get(event);
  if (!set) return;
  set.forEach(cb => {
    try {
      cb(...args);
    } catch (e) {
      // swallow errors to avoid crashing emitter
      // could log
    }
  });
};
