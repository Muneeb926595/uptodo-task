import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Colors, Typography } from '../../theme';
import { Layout } from '../../globals';
import { useStyles } from './styles';

export interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onHide?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  visible,
  duration = 5000,
  onHide,
  actionLabel,
  onActionPress,
}) => {
  const styles = useStyles();
  const translateY = useRef(new Animated.Value(100)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      // Show toast
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      // Auto hide after duration
      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          hideToast();
        }, duration);
      }
    } else {
      hideToast();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible]);

  const hideToast = () => {
    Animated.timing(translateY, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onHide?.();
    });
  };

  const handleActionPress = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onActionPress?.();
    hideToast();
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onActionPress && (
        <TouchableOpacity
          onPress={handleActionPress}
          style={styles.actionButton}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};
