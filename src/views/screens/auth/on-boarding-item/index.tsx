import React from 'react';
import { View, Image } from 'react-native';

import { AppText } from '../../../../views/components/text';
import { styles } from './styles';

type CarouselData = {
  source?: string;
  url?: string;
  heading?: React.ReactNode;
  subHeading?: string;
  title?: string;
  accessibilityLabel?: string;
  description?: string;
  id: string | number;
  imageStyles?: any;
};

type Props = {
  item: CarouselData;
  renderDots: any;
};

export const OnBoardingCarouselItem = ({ item, renderDots }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          accessible={true}
          resizeMode={'contain'}
          style={[styles.image, item?.imageStyles]}
          source={item?.source as any}
          accessibilityLabel={item?.accessibilityLabel}
        />
        {renderDots}
      </View>
      <View style={styles.contentContainer}>
        {item?.heading}
        <AppText style={styles.description}>{item?.description}</AppText>
      </View>
    </View>
  );
};
