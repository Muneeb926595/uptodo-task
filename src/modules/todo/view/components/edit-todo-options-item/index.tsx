import { magicModal } from 'react-native-magic-modal';
import { CalendarPicker } from '../../../../../app/components/calendar-picker';
import { Category, PriorityLevel } from '../../../types';
import {
  EditTodoActionType,
  EditTodoOptions,
} from '../../screens/edit-todo-screen/types';
import { DeleteTaskConfirmation } from '../delete-todo-confirmation';
import { formatTodoDateTime } from '../../../../../app/utils';
import { AppText } from '../../../../../app/components/text';
import { TouchableOpacity, View } from 'react-native';
import { Images, Layout } from '../../../../../app/globals';
import { CustomImage } from '../../../../../app/components/custom-image';
import { FormattedMessage } from '../../../../../app/localisation/locale-formatter';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { useStyles } from './styles';
import { AppIcon } from '../../../../../app/components/icon';
import { AppIconSize } from '../../../../../app/components/icon/types';
import { Colors } from '../../../../../app/theme';
import { Conditional } from '../../../../../app/components/conditional';
import { TodoCategoryPicker } from '../../../../categories/view/components';
import { TodoPriorityPicker } from '../todo-priority-picker';

type ListItemProps = {
  item: EditTodoOptions;
  todoTitle: string;
  selectedDate: Date | null;
  category: Category;
  priority: PriorityLevel;
  setSelectedDate: (date: Date | null) => void;
  setCategory: (category: Category) => void;
  setPriority: (priority: PriorityLevel) => void;
};

export const EditTodoOptionsListItem = ({
  item,
  todoTitle,
  setSelectedDate,
  setCategory,
  setPriority,
  selectedDate,
  category,
  priority,
}: ListItemProps) => {
  const doSelectedOperation = async (selectedOp: string) => {
    switch (selectedOp) {
      case EditTodoActionType.TodoDueDate:
        await magicModal.show(() => (
          <CalendarPicker
            onCancel={() => magicModal.hideAll()}
            onConfirm={date => {
              setSelectedDate(date);
              magicModal.hideAll();
            }}
          />
        )).promise;
        break;
      case EditTodoActionType.TodoCategory:
        await magicModal.show(() => (
          <TodoCategoryPicker
            onConfirm={newCategory => {
              setCategory(newCategory);
              magicModal.hideAll();
            }}
          />
        )).promise;
        break;
      case EditTodoActionType.TodoPriority:
        await magicModal.show(() => (
          <TodoPriorityPicker
            onCancel={() => {
              magicModal.hideAll();
            }}
            onConfirm={newPriority => {
              setPriority(newPriority);
              magicModal.hideAll();
            }}
          />
        )).promise;
        break;
      case EditTodoActionType.DeleteTodo:
        await magicModal.show(() => (
          <DeleteTaskConfirmation
            todoTitle={todoTitle}
            onCancel={() => {
              magicModal.hideAll();
            }}
            onConfirm={() => {
              magicModal.hideAll();
            }}
          />
        )).promise;
        break;
    }
  };

  const renderRightSection = (sectionId: EditTodoActionType) => {
    switch (sectionId) {
      case EditTodoActionType.TodoDueDate:
        return (
          <AppText style={styles.sectionActionLabel}>
            {formatTodoDateTime(selectedDate as Date)}
          </AppText>
        );
      case EditTodoActionType.TodoCategory:
        return (
          <View
            style={[styles.row, { columnGap: Layout.widthPercentageToDP(2) }]}
          >
            <CustomImage
              uri={category?.icon}
              imageStyles={styles.categoryIcon}
              placeHolder={Images.DefaultTodo}
              resizeMode="cover"
            />
            <AppText style={styles.sectionActionLabel}>
              {category?.name || 'None'}
            </AppText>
          </View>
        );
      case EditTodoActionType.TodoPriority:
        return (
          <AppText style={styles.sectionActionLabel}>
            {priority || 'None'}
          </AppText>
        );
      case EditTodoActionType.TodoSubTask:
        return (
          <AppText style={styles.sectionActionLabel}>
            <FormattedMessage id={LocaleProvider.IDs.label.addSubTask} />
          </AppText>
        );
      default:
        return null;
    }
  };

  const styles = useStyles();
  return (
    <TouchableOpacity
      onPress={() => doSelectedOperation(item?.id)}
      style={styles.sectionsContainer}
    >
      <View style={[styles.row, { columnGap: Layout.widthPercentageToDP(2) }]}>
        <AppIcon
          name={item?.leftIconName!}
          color={item?.isDanger ? Colors.red : Colors.white}
          iconSize={AppIconSize.primary}
        />
        <AppText
          style={[
            styles.sectionLabel,
            { color: item?.isDanger ? Colors.red : Colors.white },
          ]}
        >
          {item?.title}
        </AppText>
      </View>
      <Conditional ifTrue={!item?.isDanger}>
        <View style={styles.sectionActionContainer}>
          {renderRightSection(item?.id as EditTodoActionType)}
        </View>
      </Conditional>
    </TouchableOpacity>
  );
};
