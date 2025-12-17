import { ImageStyle, StyleProp, TextStyle } from 'react-native';
import React, { useState } from 'react';
import FastImage from '@d11/react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { Images } from '../../globals';
import { LocaleProvider } from '../../localisation/locale-provider';
import { isValidUrl } from '../../utils';

type Props = {
  uri: any;
  imageStyles: StyleProp<ImageStyle | TextStyle>;
  svgDimensions?: {
    width: any;
    height: any;
  };
  placeHolder: any;
  resizeMode: 'contain' | 'cover' | 'stretch' | 'center';
};

export const CustomImage = ({
  uri,
  imageStyles,
  resizeMode,
  placeHolder,
  svgDimensions,
}: Props) => {
  const [imageLoadFail, setImageLoadFail] = useState(false);

  const handleImageLoadError = () => {
    setImageLoadFail(true);
  };
  return (
    <>
      {uri?.toString()?.slice(-4) === '.svg' ? (
        <SvgUri
          style={imageStyles}
          width={svgDimensions?.width}
          height={svgDimensions?.height}
          uri={uri}
        />
      ) : (
        <FastImage
          key={uri}
          resizeMode={resizeMode || 'contain'}
          source={
            uri !== undefined
              ? isValidUrl(uri) && !imageLoadFail
                ? { uri: uri }
                : placeHolder ?? Images.DefaultTodo
              : placeHolder ?? Images.DefaultTodo
          }
          // @ts-ignore
          style={imageStyles}
          onError={handleImageLoadError}
        />
      )}
    </>
  );
};
