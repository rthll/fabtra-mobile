import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { validationStyles } from '../../styles/validationStyles';
import { formatDateBR } from '../../utils/passValidation';
import { buildPassengerQrPayload } from '../../utils/passengerIdentity';

export function QRCodeModal({ visible, passenger, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={validationStyles.modalOverlay}>
        <View style={validationStyles.qrModal}>
          <Text style={validationStyles.modalTitle}>QR Code do Passageiro</Text>
          {passenger && (
            <>
              <Text style={validationStyles.qrName}>{passenger.name}</Text>
              <Text style={validationStyles.qrCode}>ID: {passenger.id}</Text>
              <View style={validationStyles.qrCodeContainer}>
                <QRCode
                  value={buildPassengerQrPayload(passenger)}
                  size={200}
                  backgroundColor="#fff"
                  color="#000"
                />
              </View>

              <View style={validationStyles.qrDetails}>
                <View style={validationStyles.qrDetailRow}>
                  <Text style={validationStyles.qrDetailLabel}>Tipo de Passe</Text>
                  <Text style={validationStyles.qrDetailValue}>
                    {passenger.passType.toUpperCase()}
                  </Text>
                </View>
                <View style={validationStyles.qrDetailRow}>
                  <Text style={validationStyles.qrDetailLabel}>Válido até</Text>
                  <Text style={validationStyles.qrDetailValue}>
                    {formatDateBR(passenger.endDate)}
                  </Text>
                </View>
              </View>

              <Text style={validationStyles.qrInfo}>
                📸 Este QR Code pode ser impresso e entregue ao passageiro para validações futuras
              </Text>
            </>
          )}
          <TouchableOpacity
            style={validationStyles.confirmButton}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={validationStyles.confirmButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
