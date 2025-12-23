import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { Button } from '../button';
import { AppText } from '../text';
import { LocaleProvider } from '../../localisation';

export const ErrorFallback = ({ error, resetError }: any) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.title}>
        {LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.somethingWentWrong,
        )}
      </AppText>
      <AppText style={styles.errorMessage}>
        {error.message ??
          "Oops! We hit a little bump in the code. Refresh and we'll get back on track!"}
      </AppText>
      <Button
        buttonLable={LocaleProvider?.formatMessage?.(
          LocaleProvider?.IDs?.label?.tryAgain,
        )}
        onPress={resetError}
      />
    </View>
  );
};
