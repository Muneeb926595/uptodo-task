import React, { useRef, useState } from 'react';
import { View, Animated, I18nManager } from 'react-native';

import { styles } from './styles';
import { Button } from '../button';
import { Fonts, Layout } from '../../globals';
import { LocaleProvider } from '../../localisation/locale-provider';
import { Colors } from '../../theme';

export const Carousel = ({ data, Component, onComplete }: any) => {
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, Layout.window.width);
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<any>(null);

  const handleNext = () => {
    if (currentPage < data.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);

      const scrollPosition = nextPage * Layout.window.width;

      flatListRef.current?.scrollToOffset({
        offset: scrollPosition,
        animated: true,
      });
    } else {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  };

  if (data && data.length) {
    return (
      <View style={{ paddingBottom: Layout.mini }}>
        <Animated.FlatList
          data={data}
          keyExtractor={(item, index) => 'key' + index}
          horizontal
          ref={flatListRef}
          pagingEnabled
          scrollEnabled={false}
          snapToAlignment="center"
          scrollEventThrottle={16}
          decelerationRate={'fast'}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }: any) => {
            return (
              <Component
                item={item}
                renderDots={
                  <View style={styles.dotView}>
                    {data.map((_: any, i: number) => {
                      let opacity = position.interpolate({
                        inputRange: [i - 1, i, i + 1],
                        outputRange: [0.2, 1, 0.2],
                        extrapolate: 'clamp',
                      });
                      let scaleX = position.interpolate({
                        inputRange: [i - 1, i, i + 1],
                        outputRange: [1, 1.8, 1], // Adjust the output range to set the desired width
                        extrapolate: 'clamp',
                      });
                      return (
                        <Animated.View
                          key={i}
                          style={[
                            { opacity, transform: [{ scaleX }] },
                            styles.animatedView,
                          ]}
                        />
                      );
                    })}
                  </View>
                }
              />
            );
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: true,
            },
          )}
        />

        <Button
          onPress={handleNext}
          buttonLable={LocaleProvider.formatMessage(
            currentPage < data.length - 1
              ? LocaleProvider.IDs.general.next
              : LocaleProvider.IDs.label.getStarted,
          )}
          authenticationRequired={false}
          btnLabelStyles={{
            color: Colors.white,
            fontSize: Layout.RFValue(15),
            ...Fonts.poppinsMedium,
          }}
          buttonContainer={{
            backgroundColor: Colors.brand['DEFAULT'],
            width: '40%',
            alignSelf: 'flex-start',
            marginHorizontal: Layout.widthPercentageToDP(
              Layout.medium / Layout.divisionFactorForWidth,
            ),
          }}
        />
      </View>
    );
  }
  return null;
};
