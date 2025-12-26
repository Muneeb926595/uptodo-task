import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Images } from '../../../../globals';
import { AppText } from '../../../components/text';
import { FormattedMessage } from '../../../../services/localisation';
import { LocaleProvider } from '../../../../services/localisation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Carousel } from '../../../components/carousel';
import { OnBoardingCarouselItem } from '../components';

type CarouselData = {
  source?: string;
  heading?: React.ReactNode;
  onComplete?: () => void;
  onSkip?: () => void;
  description?: string;
  accessibilityLabel?: string;
  id: string | number;
  imageStyles?: any;
};
export const OnboardingScreen = (props: any) => {
  const carouselData: CarouselData[] = [
    {
      id: 1,
      source: Images.WelcomeCarousel1,
      heading: (
        <View>
          <AppText style={[styles.heading]}>
            <FormattedMessage
              id={LocaleProvider.IDs.instruction.onboarding1Title}
            />
          </AppText>
        </View>
      ),
      description: LocaleProvider.formatMessage(
        LocaleProvider.IDs.instruction.onboarding1Description,
      ),
    },
    {
      id: 2,
      source: Images.WelcomeCarousel2,
      heading: (
        <View>
          <AppText style={[styles.heading]}>
            <FormattedMessage
              id={LocaleProvider.IDs.instruction.onboarding2Title}
            />
          </AppText>
        </View>
      ),
      description: LocaleProvider.formatMessage(
        LocaleProvider.IDs.instruction.onboarding2Description,
      ),
    },
    {
      id: 3,
      source: Images.WelcomeCarousel3,
      heading: (
        <View>
          <AppText style={[styles.heading]}>
            <FormattedMessage
              id={LocaleProvider.IDs.instruction.onboarding3Title}
            />
          </AppText>
        </View>
      ),
      description: LocaleProvider.formatMessage(
        LocaleProvider.IDs.instruction.onboarding3Description,
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Carousel
        onComplete={props?.onComplete}
        onSkip={props?.onSkip}
        data={carouselData}
        Component={OnBoardingCarouselItem}
      />
    </SafeAreaView>
  );
};
