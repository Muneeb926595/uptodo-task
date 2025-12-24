import React from 'react';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { styles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { FormattedMessage } from '../../../../../app/localisation/locale-formatter';
import { AppText } from '../../../../../app/components/text';
import { ScreenProps } from '../../../../../app/navigation';

export const WelcomeScreen = (props: ScreenProps<'WelcomeScreen'>) => {
  const handleLogin = () => {
    props.navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      {/* empty spave at the top */}
      <View />

      {/* center content */}
      <View>
        {/* <Image style={styles.logo} source={Images.Logo} /> */}
        <AppText style={styles.label}>
          <FormattedMessage id={LocaleProvider.IDs.label.tagline} />
        </AppText>
        <AppText style={styles.label}>
          <FormattedMessage id={LocaleProvider.IDs.label.detailedTagline} />
        </AppText>
      </View>

      {/* footer */}
      <View style={styles.row}>
        <AppText style={styles.label}>
          <FormattedMessage
            id={LocaleProvider.IDs.label.alreadyHaveAnAccount}
          />
        </AppText>
        <TouchableOpacity onPress={handleLogin}>
          <AppText style={styles.label}>
            <FormattedMessage id={LocaleProvider.IDs.label.login} />
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
