import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { validationStyles } from '../../styles/validationStyles';
import { formatDateBR } from '../../utils/passValidation';

/**
 * Modern Passenger Card Component
 * Displays passenger info with status and action buttons
 */
export function PassengerCard({ passenger, isValid, onValidate, onShowQR }) {
  const statusColor = isValid
    ? validationStyles.passengerCardValid
    : validationStyles.passengerCardInvalid;

  return (
    <View style={[validationStyles.passengerCard, statusColor]}>
      <View style={validationStyles.passengerInfo}>
        <Text style={validationStyles.passengerName}>{passenger.name}</Text>
        <Text style={validationStyles.passengerDetail}>
          <Text style={validationStyles.passengerDetailLabel}>ID: </Text>
          {passenger.id}
        </Text>
        <Text style={validationStyles.passengerDetail}>
          <Text style={validationStyles.passengerDetailLabel}>Telefone: </Text>
          {passenger.phone}
        </Text>
        <Text style={validationStyles.passengerDetail}>
          <Text style={validationStyles.passengerDetailLabel}>Válido até: </Text>
          {formatDateBR(passenger.endDate)}
        </Text>
        <View style={validationStyles.badge}>
          <Text style={validationStyles.badgeText}>
            {passenger.passType.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={validationStyles.statusIcon}>
        <Text
          style={
            isValid
              ? validationStyles.validIcon
              : validationStyles.invalidIcon
          }
        >
          {isValid ? '✓' : '✗'}
        </Text>
      </View>

      <View style={validationStyles.cardButtons}>
        <TouchableOpacity
          style={validationStyles.validateButton}
          onPress={onValidate}
          activeOpacity={0.8}
        >
          <Text style={validationStyles.validateButtonText}>✓ Validar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={validationStyles.qrButton}
          onPress={onShowQR}
          activeOpacity={0.7}
        >
          <Text style={validationStyles.qrButtonText}>QR Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
