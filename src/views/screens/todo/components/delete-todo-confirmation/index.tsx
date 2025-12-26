import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import { styles } from './styles';
import { AppText, Divider } from '../../../../components';
import {
  FormattedMessage,
  LocaleProvider,
} from '../../../../../services/localisation';

type Props = {
  todoTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export const DeleteTaskConfirmation = ({
  todoTitle,
  onCancel,
  onConfirm,
}: Props) => {
  return (
    <View style={styles.backdrop}>
      <View style={styles.container}>
        <AppText style={styles.heading}>
          <FormattedMessage id={LocaleProvider.IDs.label.deleteTask} />
        </AppText>
        <Divider />

        <View style={styles.messageContainer}>
          <AppText style={styles.message}>
            <FormattedMessage
              id={
                LocaleProvider.IDs.instruction.areYouSureYouWantToDeleteThisTask
              }
            />
          </AppText>
          <AppText style={styles.message}>
            <FormattedMessage
              id={LocaleProvider.IDs.label.taskTitle}
              values={{ title: todoTitle }}
            />
          </AppText>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <AppText style={styles.cancel}>
              <FormattedMessage id={LocaleProvider.IDs.general.cancel} />
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirm} style={styles.chooseBtn}>
            <AppText style={styles.chooseText}>
              <FormattedMessage id={LocaleProvider.IDs.label.delete} />
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
