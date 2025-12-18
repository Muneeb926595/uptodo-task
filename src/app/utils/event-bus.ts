// we can use this bus to listen on events and emit events with in the front end app
// For example i can open a top level modal by passing an event to a component and then that component can then open the modal
// emit('open-top-level-modal')
// then in component use on('open-top-level-modal') and based on that event i can set the local state within that component
// in this way we dont have to place the modal in app.tsx and also keep his state as well so if state change the whole tsx will re-render it avoids that situation
// loook at this example
// export const AddTaskModal = () => {
//   const [addVisible, setAddVisible] = useState(false);

//   useEffect(() => {
//     const unsub = on('open-add-task', () => setAddVisible(true));
//     return () => unsub();
//   }, []);

//   return (
//     <>
//       <AddTaskActionSheet
//         visible={addVisible}
//         onClose={() => setAddVisible(false)}
//         onSubmit={data => {
//           // TODO: wire to task service / redux
//           console.log('Task created from modal registry:', data);
//           setAddVisible(false);
//         }}
//       />
//     </>
//   );
// };

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
