import { magicModal } from 'react-native-magic-modal';
import { CalendarPicker } from '../../../../../app/components/calendar-picker';
import { Category, PriorityLevel, Todo } from '../../../types';
import {
  EditTodoActionType,
  EditTodoOptions,
} from '../../screens/edit-todo-screen/types';
import { DeleteTaskConfirmation } from '../delete-todo-confirmation';
import { formatTodoDateTime } from '../../../../../app/utils';
import { AppText } from '../../../../../app/components/text';
import { Alert, TouchableOpacity, View } from 'react-native';
import { Constants, Images, Layout } from '../../../../../app/globals';
import { CustomImage } from '../../../../../app/components/custom-image';
import { FormattedMessage } from '../../../../../app/localisation/locale-formatter';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { styles } from './styles';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { Colors } from '../../../../../app/theme';
import { Conditional } from '../../../../../app/components/conditional';
import { TodoCategoryPicker } from '../../../../categories/view/components';
import { TodoPriorityPicker } from '../todo-priority-picker';
import { useDeleteTodo } from '../../../react-query';
import { magicSheet } from 'react-native-magic-sheet';
import { navigationRef } from '../../../../../app/navigation';
import {
  mediaService,
  PickedImage,
} from '../../../../services/media';
import { useImagePicker } from '../../../../../app/hooks';

type ListItemProps = {
  item: EditTodoOptions;
  todo: Partial<Todo>;
  selectedDate: Date | null;
  category: Category;
  priority: PriorityLevel;
  attachments: string[] | undefined;
  setSelectedDate: (date: Date | null) => void;
  setCategory: (category: Category) => void;
  setPriority: (priority: PriorityLevel) => void;
  setAttachments: (attachments: string[] | undefined) => void;
};

export const EditTodoOptionsListItem = ({
  item,
  todo,
  attachments,
  selectedDate,
  category,
  priority,
  setSelectedDate,
  setCategory,
  setPriority,
  setAttachments,
}: ListItemProps) => {
  const deleteTodoMutation = useDeleteTodo();

  const persistImageOnPhoneStorage = async (imageObj: PickedImage) => {
    const persistedUri = await mediaService.persistImage(imageObj?.uri);
    setAttachments([persistedUri]);
    return persistedUri;
  };

  const { pickAndUpload, isLoading, imageUri } = useImagePicker({
    uploader: persistImageOnPhoneStorage,
  });

  const handleDeleteTodo = async () => {
    try {
      await deleteTodoMutation.mutateAsync(todo?.id as string);
      magicModal.hideAll();
      magicSheet.hide();
      navigationRef.goBack();
    } catch (err) {
      Alert.alert('Error', 'Unable to delete todo');
    }
  };

  const doSelectedOperation = async (selectedOp: string) => {
    switch (selectedOp) {
      case EditTodoActionType.TodoDueDate:
        await magicModal.show(
          () => (
            <CalendarPicker
              onCancel={() => magicModal.hideAll()}
              onConfirm={date => {
                setSelectedDate(date);
                magicModal.hideAll();
              }}
            />
          ),
          { swipeDirection: undefined },
        ).promise;
        break;
      case EditTodoActionType.TodoCategory:
        await magicModal.show(
          () => (
            <TodoCategoryPicker
              onConfirm={newCategory => {
                setCategory(newCategory);
                magicModal.hideAll();
              }}
            />
          ),
          { swipeDirection: undefined },
        ).promise;
        break;
      case EditTodoActionType.TodoPriority:
        await magicModal.show(
          () => (
            <TodoPriorityPicker
              onCancel={() => {
                magicModal.hideAll();
              }}
              onConfirm={newPriority => {
                setPriority(newPriority);
                magicModal.hideAll();
              }}
            />
          ),
          { swipeDirection: undefined },
        ).promise;
        break;
      case EditTodoActionType.DeleteTodo:
        await magicModal.show(() => (
          <DeleteTaskConfirmation
            todoTitle={todo.title as string}
            onCancel={() => {
              magicModal.hideAll();
            }}
            onConfirm={() => {
              handleDeleteTodo();
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
      case EditTodoActionType.TodoAttachments:
        return (
          <TouchableOpacity
            hitSlop={Constants.defaults.DEFAULT_TOUCH_HIT_SLOP}
            style={styles.galleryPicker}
            onPress={pickAndUpload}
          >
            <Conditional
              ifTrue={attachments?.length! > 0}
              elseChildren={
                <AppIcon
                  name={AppIconName.image}
                  color={Colors.white}
                  iconSize={AppIconSize.xlarge}
                />
              }
            >
              <CustomImage
                uri={attachments?.[0]}
                imageStyles={styles.attachment}
                placeHolder={Images.DefaultTodo}
                resizeMode="cover"
              />
            </Conditional>
          </TouchableOpacity>
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
