import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { validationStyles } from '../../styles/validationStyles';

export function CounterCard({ count }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: count,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [count, animatedValue]);

  return (
    <View style={validationStyles.counterCard}>
      <View style={validationStyles.counterContent}>
        <Text style={validationStyles.counterLabel}>Validações Hoje</Text>
        <Animated.Text style={validationStyles.counterValue}>
          {count}
        </Animated.Text>
      </View>
      <Text style={validationStyles.counterIcon}>📊</Text>
    </View>
  );
}
