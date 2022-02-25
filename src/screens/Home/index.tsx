import React, { useState } from 'react';
import { ToolbarAndroid, TouchableOpacity, View, Dimensions } from 'react-native';
import { Svg, Circle, Path } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  useSharedValue, 
  interpolate,
  withTiming,
  Easing,
  withRepeat,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);

import { Fontisto } from '@expo/vector-icons';

import { styles } from './styles';
import { theme } from '../../styles/theme';
import { Header } from '../components/Header';

const { width } = Dimensions.get('screen');

export function Home() {
  const [percentage, setPercentage] = useState(0)
  const heightAnimated = useSharedValue(100);
  const waveAnimated = useSharedValue(5); 
  const buttonBorderAnimated = useSharedValue(0);

  const buttonProps = useAnimatedProps(() => {
    return {
      cx: 60,
      cy: 60,
      r: 40,
      fill: theme.colors.blue100,
      strokeWidth: interpolate(buttonBorderAnimated.value,
        [0, .5, 1],
        [17, 40, 17]
      ),
      stroke: theme.colors.blue90,
      strokeOpacity: 0.5
    }
  });

  const firstWaveProps = useAnimatedProps(() => {
    return {
      d:`
        M 0 0
        Q 45 ${waveAnimated.value + 5} 90 0
        T 180 0
        T 270 0
        T 360 0
        T 900 0
        T 540 0
        V ${heightAnimated.value}
        H 0
        Z
      `
    }
  });

  const secondWaveProps = useAnimatedProps(() => {
    return {
      d:`
        M 0 0
        Q 35 ${waveAnimated.value + 5} 70 0
        T 140 0
        T 210 0
        T 280 0
        T 350 0
        T 420 0
        V ${heightAnimated.value}
        H 0
        Z
      `
    }
  })

  const svgContainerProps = useAnimatedProps(() => {
    return {
      width,
      height: heightAnimated.value,
      viewBox: `0 0 ${width} ${heightAnimated.value}`
    }
  })

  function handleDrink() {
    buttonBorderAnimated.value = 0;
    waveAnimated.value = 5;

    buttonBorderAnimated.value = withTiming(1, {
      duration: 500,
      easing: Easing.ease
    });

    waveAnimated.value = withRepeat(withTiming(
      17,
      {
        duration: 500,
        easing: Easing.ease
      }
    ), 2, true);

    heightAnimated.value = withTiming(heightAnimated.value + 100, {
      duration: 1000,
      easing: Easing.ease
    });

    setPercentage(Math.trunc(heightAnimated.value * .1))
  }

  return (
    <View style={styles.container}>
      <Header ml={percentage===0?0:heightAnimated.value} percent={percentage} />

      <AnimatedSvg animatedProps={svgContainerProps}>
        <AnimatedPath 
          animatedProps={firstWaveProps}
          fill={theme.colors.blue100}
          transform="translate(0, 10)"
        />
        <AnimatedPath 
          animatedProps={secondWaveProps}
          fill={theme.colors.blue70}
          transform="translate(0, 15)"
        />
      </AnimatedSvg>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleDrink}
        >
          <Svg width={120} height={120}>
            <AnimatedCircle animatedProps={buttonProps} />
          </Svg>
          <Fontisto
            name="blood-drop"
            size={32}
            color={theme.colors.blue90}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}