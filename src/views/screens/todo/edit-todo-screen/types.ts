import { ReactNode } from 'react';
import { AppIconName } from '../../../../views/components/icon/types';

export enum EditTodoActionType {
  TodoDueDate = 'TodoDueDate',
  TodoCategory = 'TodoCategory',
  TodoPriority = 'TodoPriority',
  TodoAttachments = 'TodoAttachments',
  TodoSubTask = 'TodoSubTask',
  DeleteTodo = 'DeleteTodo',
}
export type EditTodoOptions = {
  id: string;
  title: string | ReactNode;
  leftIconName?: AppIconName;
  isDanger?: boolean;
};
