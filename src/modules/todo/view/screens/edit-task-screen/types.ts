import { ReactNode } from 'react';
import { AppIconName } from '../../../../../app/components/icon/types';

export enum EditTodoActionType {
  TaskDueDate = 'TaskDueDate',
  TaskCategory = 'TaskCategory',
  TaskPriority = 'TaskPriority',
  TaskSubTask = 'TaskSubTask',
  DeleteTask = 'DeleteTask',
}
export type EditTodoOptions = {
  id: string;
  title: string | ReactNode;
  leftIconName?: AppIconName;
  isDanger?: boolean;
};
