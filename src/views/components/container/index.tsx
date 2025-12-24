import React from 'react';
import {
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  Platform,
  View,
  ImageBackground,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

import { styles } from './styles';
import { Props } from './types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';

export const Container = (props: Props) => {
  const { theme } = useTheme();
  const {
    hasScroll,
    bounces,
    onScroll,
    scrollEventThrottle,
    options,
    keyboardBehaviour,
    persistTaps,
    insetsToHandle,
    containerStyles,
    screenBackgroundStyle,
    scrollViewContentContainerStyles,
  } = props;
  const isAndroid = Platform.OS === 'android';

  const BaseBodyContainer = (
    <View style={[styles.bodyContainer, containerStyles]} {...props} />
  );

  const BodyContent =
    options && options.backgroundImage ? (
      <ImageBackground
        source={options.backgroundImage}
        style={styles.backgroundImageStyle}
      >
        {BaseBodyContainer}
      </ImageBackground>
    ) : (
      BaseBodyContainer
    );

  return (
    <SafeAreaView
      style={[
        styles.screenContainer,
        { backgroundColor: theme.colors.background },
        screenBackgroundStyle,
      ]}
      edges={insetsToHandle ?? ['top', 'bottom', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // @ts-ignore
        behavior={
          keyboardBehaviour ? keyboardBehaviour : isAndroid ? null : 'padding'
        }
        keyboardVerticalOffset={
          useHeaderHeight() + (StatusBar.currentHeight ?? 0)
        }
      >
        {hasScroll ? (
          <ScrollView
            bounces={bounces}
            onScroll={onScroll}
            scrollEventThrottle={scrollEventThrottle}
            keyboardShouldPersistTaps={persistTaps ? 'always' : 'never'}
            contentContainerStyle={scrollViewContentContainerStyles}
          >
            {BodyContent}
          </ScrollView>
        ) : (
          <>{BodyContent}</>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
