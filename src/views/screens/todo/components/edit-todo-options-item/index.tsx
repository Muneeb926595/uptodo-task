import { magicModal } from 'react-native-magic-modal';
import { DeleteTaskConfirmation } from '../delete-todo-confirmation';
import { Alert, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { magicSheet } from 'react-native-magic-sheet';
import {
  EditTodoActionType,
  EditTodoOptions,
} from '../../edit-todo-screen/types';
import { Category, PriorityLevel, Todo } from '../../../../../types';
import { useDeleteTodo } from '../../../../../react-query';
import { mediaService, PickedImage } from '../../../../../services/media';
import { useImagePicker } from '../../../../../hooks';
import { navigationRef } from '../../../../navigation';
import {
  FormattedMessage,
  LocaleProvider,
} from '../../../../../services/localisation';
import {
  AppIcon,
  AppText,
  CalendarPicker,
  Conditional,
  CustomImage,
} from '../../../../components';
import { TodoCategoryPicker } from '../../../categories';
import { TodoPriorityPicker } from '../todo-priority-picker';
import { formatTodoDateTime } from '../../../../../utils';
import { Constants, Images } from '../../../../../globals';
import { AppIconName, AppIconSize } from '../../../../components/icon/types';
import { Colors } from '../../../../../theme';

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

  const { pickAndUpload } = useImagePicker({
    uploader: persistImageOnPhoneStorage,
  });

  const handleDeleteTodo = async () => {
    try {
      await deleteTodoMutation.mutateAsync(todo?.id as string);
      magicModal.hideAll();
      magicSheet.hide();
      navigationRef.goBack();
    } catch (err) {
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.unableToDeleteTodo,
        ),
      );
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
          <View style={[styles.row, styles.rowGap]}>
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
      <View style={[styles.row, styles.rowGap]}>
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
