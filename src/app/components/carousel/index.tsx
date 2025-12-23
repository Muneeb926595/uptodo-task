import React, { useRef, useState } from 'react';
import { View, Animated, I18nManager } from 'react-native';

import { Button } from '../button';
import { Fonts, Layout } from '../../globals';
import { LocaleProvider } from '../../localisation/locale-provider';
import { Colors } from '../../theme';
import { styles } from './styles';

export const Carousel = ({ data, Component, onComplete }: any) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const position = useRef(
    Animated.divide(scrollX, Layout.window.width),
  ).current;
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<any>(null);

  const handleNext = () => {
    const nextPage =
      currentPage < data.length - 1 ? currentPage + 1 : currentPage;

    if (currentPage < data.length - 1) {
      setCurrentPage(nextPage);
      flatListRef.current?.scrollToOffset({
        offset: nextPage * Layout.window.width,
        animated: true,
      });
    } else {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  };
  const handlePrevious = () => {
    const prevPage = currentPage > 0 ? currentPage - 1 : currentPage;

    if (currentPage > 0) {
      setCurrentPage(prevPage);
      flatListRef.current?.scrollToOffset({
        offset: prevPage * Layout.window.width,
        animated: true,
      });
    } else {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
    },
  );

  const handleMomentumScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / Layout.window.width);
    if (page !== currentPage) {
      setCurrentPage(page);
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
          scrollEnabled={true}
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
                        outputRange: [1, 1, 1], // Adjust the output range to set the desired width
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
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        />

        <View style={styles.rowBetween}>
          <Button
            onPress={handlePrevious}
            buttonLable={LocaleProvider.formatMessage(
              LocaleProvider.IDs.general.back,
            )}
            btnLabelStyles={{
              color: `${Colors.white}66`,
              fontSize: Layout.RFValue(15),
              fontWeight: '400',
              ...Fonts.latoRegular,
              textAlign: 'left',
            }}
            buttonContainer={{
              backgroundColor: Colors.transparent,
              width: '40%',
              alignSelf: 'flex-start',
              justifyContent: 'flex-start',
              marginHorizontal: Layout.widthPercentageToDP(
                Layout.medium / Layout.divisionFactorForWidth,
              ),
            }}
          />
          <Button
            onPress={handleNext}
            buttonLable={LocaleProvider.formatMessage(
              currentPage < data.length - 1
                ? LocaleProvider.IDs.general.next
                : LocaleProvider.IDs.label.getStarted,
            )}
            btnLabelStyles={{
              color: Colors.white,
              fontSize: Layout.RFValue(15),
              fontWeight: '400',
              ...Fonts.latoRegular,
            }}
            buttonContainer={{
              backgroundColor: Colors.brand['DEFAULT'],
              width: '30%',
              alignSelf: 'flex-start',
              marginHorizontal: Layout.widthPercentageToDP(
                Layout.medium / Layout.divisionFactorForWidth,
              ),
              borderRadius: 4,
            }}
          />
        </View>
      </View>
    );
  }
  return null;
};
