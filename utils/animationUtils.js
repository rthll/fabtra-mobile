/**
 * Animation Utilities
 * Reusable animation configurations and helpers
 */

import { Animated, Easing } from 'react-native';

// Animation presets
export const AnimationPresets = {
  /**
   * Quick fade in animation
   */
  fadeIn: {
    duration: 300,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  },

  /**
   * Smooth slide from bottom
   */
  slideUp: {
    duration: 400,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  },

  /**
   * Subtle scale animation
   */
  scaleIn: {
    duration: 400,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  },

  /**
   * Bounce animation
   */
  bounce: {
    duration: 600,
    easing: Easing.bounce,
    useNativeDriver: true,
  },

  /**
   * Pulse animation (repeating)
   */
  pulse: {
    duration: 1500,
    easing: Easing.inOut(Easing.sin),
    useNativeDriver: true,
  },
};

/**
 * Create a fade in animation
 * @param {number} delay - Delay before animation starts
 * @returns {Object} Animated value and style
 */
export function useFadeIn(delay = 0) {
  const fadeAnim = new Animated.Value(0);

  const startAnimation = () => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  return {
    fadeAnim,
    fadeStyle: {
      opacity: fadeAnim,
    },
    startAnimation,
  };
}

/**
 * Create a scale animation
 * @param {number} fromScale - Starting scale value (default 0.9)
 * @returns {Object} Animated value and style
 */
export function useScaleIn(fromScale = 0.9) {
  const scaleAnim = new Animated.Value(fromScale);

  const startAnimation = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return {
    scaleAnim,
    scaleStyle: {
      transform: [{ scale: scaleAnim }],
    },
    startAnimation,
  };
}

/**
 * Create a press animation
 * @returns {Object} Animated values and handlers
 */
export function usePressAnimation() {
  const scaleAnim = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return {
    pressStyle: {
      transform: [{ scale: scaleAnim }],
    },
    onPressIn,
    onPressOut,
  };
}

/**
 * Create a slide up animation
 * @param {number} distance - Distance to slide (default 50)
 * @returns {Object} Animated values and style
 */
export function useSlideUp(distance = 50) {
  const slideAnim = new Animated.Value(distance);

  const startAnimation = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return {
    slideAnim,
    slideStyle: {
      opacity: slideAnim.interpolate({
        inputRange: [0, distance],
        outputRange: [1, 0],
      }),
      transform: [
        {
          translateY: slideAnim,
        },
      ],
    },
    startAnimation,
  };
}

/**
 * Create a pulse animation (repeating)
 * @returns {Object} Animated value and style
 */
export function usePulse() {
  const pulseAnim = new Animated.Value(1);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 750,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 750,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  return {
    pulseStyle: {
      transform: [{ scale: pulseAnim }],
    },
    startAnimation,
  };
}

/**
 * Create a staggered animation for lists
 * @param {number} itemCount - Number of items
 * @param {number} delayPerItem - Delay between items (ms)
 * @returns {Array} Array of animated values
 */
export function useStaggerAnimation(itemCount, delayPerItem = 50) {
  const animations = Array.from({ length: itemCount }).map(() => new Animated.Value(0));

  const startAnimation = () => {
    animations.forEach((anim, index) => {
      Animated.sequence([
        Animated.delay(index * delayPerItem),
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const animationStyles = animations.map((anim) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  }));

  return {
    animationValues: animations,
    animationStyles,
    startAnimation,
  };
}

/**
 * Create a counter animation from 0 to a value
 * @param {number} toValue - Target value
 * @param {number} duration - Animation duration (ms)
 * @returns {Object} Animated value
 */
export function useCounterAnimation(toValue, duration = 600) {
  const counterAnim = new Animated.Value(0);

  const startAnimation = () => {
    Animated.timing(counterAnim, {
      toValue,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return {
    counterAnim,
    startAnimation,
  };
}

export default AnimationPresets;
