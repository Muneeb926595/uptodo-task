import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { styles } from './styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

type AddTaskPayload = {
  title: string;
  description?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: AddTaskPayload) => void;
};

export const AddTaskActionSheet: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({ title, description });
    setTitle('');
    setDescription('');
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <Pressable style={styles.backdrop} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <Text style={styles.heading}>Add Task</Text>

          <TextInput
            placeholder="Do math homework"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            placeholder="Description"
            placeholderTextColor="#6B7280"
            style={[styles.input, styles.description]}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {/* Action Row */}
          <View style={styles.actionsRow}>
            <ActionIcon label="⏰" />
            <ActionIcon label="🏷️" />
            <ActionIcon label="🚩" />

            <Pressable style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitIcon}>➤</Text>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const ActionIcon = ({ label }: { label: string }) => (
  <View style={styles.iconBtn}>
    <Text style={styles.icon}>{label}</Text>
  </View>
);
