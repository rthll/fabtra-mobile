import React from 'react';
import { View, Text } from 'react-native';
import { validationStyles } from '../../styles/validationStyles';

export function CounterCard({ count }) {
  return (
    <View style={validationStyles.counterCard}>
      <View style={validationStyles.counterContent}>
        <Text style={validationStyles.counterLabel}>Validações Hoje</Text>
        <Text style={validationStyles.counterValue}>{count}</Text>
      </View>
      <Text style={validationStyles.counterIcon}>📊</Text>
    </View>
  );
}
