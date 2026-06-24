import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { validationStyles } from '../../styles/validationStyles';

/**
 * Modern Scanner Modal
 * QR code scanner with enhanced UI and frame guidance
 */
export function ScannerModal({ visible, hasPermission, onClose, onBarCodeScanned }) {
  // O expo-camera dispara onBarcodeScanned varias vezes por segundo enquanto o QR
  // estiver visivel. Sem trava, isso empilha alerts e executa o fluxo multiplas vezes.
  // scannedRef ignora callbacks apos o primeiro scan e e resetada ao reabrir o modal.
  const scannedRef = useRef(false);

  useEffect(() => {
    if (visible) {
      scannedRef.current = false;
    }
  }, [visible]);

  const handleBarcodeScanned = (event) => {
    if (scannedRef.current) {
      return;
    }
    scannedRef.current = true;
    onBarCodeScanned?.(event);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={validationStyles.scannerContainer}>
        {hasPermission ? (
          <>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              onBarcodeScanned={handleBarcodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            />
            <View style={validationStyles.scannerOverlay}>
              {/* Scanner frame with corners */}
              <View style={validationStyles.scannerFrame}>
                <View style={[validationStyles.scannerCorner, validationStyles.scannerCornerTL]} />
                <View style={[validationStyles.scannerCorner, validationStyles.scannerCornerTR]} />
                <View style={[validationStyles.scannerCorner, validationStyles.scannerCornerBL]} />
                <View style={[validationStyles.scannerCorner, validationStyles.scannerCornerBR]} />
              </View>

              <Text style={validationStyles.scannerText}>
                📱 Aponte para o QR Code
              </Text>
              <Text style={validationStyles.scannerSubtext}>
                Centralize o código de barras dentro do frame
              </Text>

              <TouchableOpacity
                style={validationStyles.closeButton}
                onPress={onClose}
                activeOpacity={0.85}
              >
                <Text style={{ fontSize: 18, marginRight: 4 }}>✕</Text>
                <Text style={validationStyles.closeButtonText}>Fechar Câmera</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={validationStyles.permissionContainer}>
            <Text style={validationStyles.permissionIcon}>📷</Text>
            <Text style={validationStyles.permissionText}>
              Permissão de Câmera Necessária
            </Text>
            <Text style={validationStyles.permissionSubtext}>
              Para usar a câmera e escanear QR Codes, você precisa conceder permissão de acesso
            </Text>
            <TouchableOpacity
              style={validationStyles.permissionButton}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={validationStyles.permissionButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}
