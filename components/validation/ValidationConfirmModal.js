import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { validationStyles } from '../../styles/validationStyles';
import { formatDateBR } from '../../utils/passValidation';

/**
 * Modern Validation Confirmation Modal
 * Shows passenger info and pass validity status
 */
export function ValidationConfirmModal({
  visible,
  passenger,
  isPassValid,
  onCancel,
  onConfirm,
}) {
  if (!passenger) return null;

  const valid = isPassValid(passenger);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={validationStyles.modalOverlay}>
        <View style={validationStyles.validationModal}>
          <Text style={validationStyles.modalTitle}>
            {valid ? '✓ ' : '✗ '}Confirmar Validação
          </Text>

          <View style={{ marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
            <Text style={validationStyles.confirmText}>
              <Text style={validationStyles.confirmLabel}>Passageiro</Text>
            </Text>
            <Text style={[validationStyles.confirmText, { fontSize: 16, fontWeight: '700', marginBottom: 12 }]}>
              {passenger.name}
            </Text>

            <Text style={validationStyles.confirmText}>
              <Text style={validationStyles.confirmLabel}>ID do Passe</Text>
            </Text>
            <Text style={[validationStyles.confirmText, { fontWeight: '600', marginBottom: 12 }]}>
              {passenger.id}
            </Text>

            <Text style={validationStyles.confirmText}>
              <Text style={validationStyles.confirmLabel}>Tipo de Passe</Text>
            </Text>
            <Text style={[validationStyles.confirmText, { fontWeight: '600', marginBottom: 12 }]}>
              {passenger.passType.toUpperCase()}
            </Text>

            <Text style={validationStyles.confirmText}>
              <Text style={validationStyles.confirmLabel}>Válido até</Text>
            </Text>
            <Text style={[validationStyles.confirmText, { fontWeight: '600' }]}>
              {formatDateBR(passenger.endDate)}
            </Text>
          </View>

          <View style={valid ? validationStyles.validCard : validationStyles.invalidCard}>
            <Text style={validationStyles.validCardIcon}>
              {valid ? '✓' : '✗'}
            </Text>
            <Text
              style={valid ? validationStyles.validCardTitle : validationStyles.invalidCardTitle}
            >
              {valid ? 'Passe Válido' : 'Passe Vencido'}
            </Text>
            <Text
              style={valid ? validationStyles.validCardText : validationStyles.invalidCardText}
            >
              {valid ? '✓ Passageiro autorizado a embarcar' : '✗ Passageiro não autorizado'}
            </Text>
          </View>

          <View style={validationStyles.modalButtons}>
            <TouchableOpacity
              style={validationStyles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={validationStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={validationStyles.confirmButton}
              onPress={() => onConfirm(passenger)}
              activeOpacity={0.85}
            >
              <Text style={validationStyles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
