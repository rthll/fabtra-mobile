import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { validationStyles } from '../../styles/validationStyles';

/**
 * Modern Search Bar Component
 * Includes search icon and clear button
 */
export function SearchBar({ value, onChangeText, onClear }) {

  return (
    <View style={validationStyles.searchContainer}>
      <View style={validationStyles.searchWrapper}>
        <Text style={validationStyles.searchIcon}>🔍</Text>
        <TextInput
          style={validationStyles.searchInput}
          placeholder="Buscar por nome ou código..."
          placeholderTextColor="#a0a0a0"
          value={value}
          onChangeText={onChangeText}
          clearButtonMode="while-editing"
        />
        {value ? (
          <TouchableOpacity
            onPress={() => {
              onChangeText('');
              onClear?.();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={validationStyles.searchClear}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
