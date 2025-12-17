import React, { useEffect, useState } from 'react';
import { on, off } from '../../utils/event-bus';
import { AddTaskActionSheet } from '../../../modules/todo/view/components/create-todo';

export const AddTaskModal = () => {
  const [addVisible, setAddVisible] = useState(false);

  useEffect(() => {
    const unsub = on('open-add-task', () => setAddVisible(true));
    return () => unsub();
  }, []);

  return (
    <>
      <AddTaskActionSheet
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onSubmit={data => {
          // TODO: wire to task service / redux
          console.log('Task created from modal registry:', data);
          setAddVisible(false);
        }}
      />
    </>
  );
};
