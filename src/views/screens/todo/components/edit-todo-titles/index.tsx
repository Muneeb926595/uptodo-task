import { TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { styles } from './styles';
import { Controller, useForm } from 'react-hook-form';
import { AppText, AuthInput, Divider } from '../../../../components';
import {
  FormattedMessage,
  LocaleProvider,
} from '../../../../../services/localisation';

type Props = {
  todoTitle: string;
  todoDescription: string;
  onCancel: () => void;
  onConfirm: ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => void;
};

export const EditTodoTitles = ({
  todoTitle,
  todoDescription,
  onCancel,
  onConfirm,
}: Props) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useLayoutEffect(() => {
    setValue('title', todoTitle);
    setValue('description', todoDescription);
  }, [todoTitle, todoDescription]);

  const handleEdit = (data: { title: string; description: string }) => {
    onConfirm({
      title: data?.title,
      description: data?.description,
    });
  };

  return (
    <View style={styles.backdrop}>
      <View style={styles.container}>
        <AppText style={styles.heading}>
          <FormattedMessage id={LocaleProvider.IDs.label.editTaskTitle} />
        </AppText>
        <Divider />

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={LocaleProvider.formatMessage(
                  LocaleProvider.IDs.label.taskName,
                )}
                isError={errors?.title}
              />
            )}
            name="title"
          />
          {errors?.title && (
            <AppText style={styles.error}>
              <FormattedMessage id={LocaleProvider.IDs.error.fieldIsRequired} />
            </AppText>
          )}

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={LocaleProvider.formatMessage(
                  LocaleProvider.IDs.label.description,
                )}
                isError={errors?.description}
              />
            )}
            name="description"
          />
          {errors?.description && (
            <AppText style={styles.error}>
              <FormattedMessage id={LocaleProvider.IDs.error.fieldIsRequired} />
            </AppText>
          )}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <AppText style={styles.cancel}>
              <FormattedMessage id={LocaleProvider.IDs.general.cancel} />
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit(handleEdit)}
            style={styles.chooseBtn}
          >
            <AppText style={styles.chooseText}>
              <FormattedMessage id={LocaleProvider.IDs.label.edit} />
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
