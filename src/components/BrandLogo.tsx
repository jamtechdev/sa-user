import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  size?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

/** Official website brand mark */
export default function BrandLogo({ size = 72, style, imageStyle }: Props) {
  return (
    <View style={[styles.wrap, { width: size, height: size }, style]}>
      <Image
        source={require('../../assets/brand-logo.png')}
        style={[{ width: size, height: size }, imageStyle]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
