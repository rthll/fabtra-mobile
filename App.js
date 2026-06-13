import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useValidationApp } from './hooks/useValidationApp';
import { validationStyles } from './styles/validationStyles';
import {
  DriverLoginScreen,
  Header,
  CounterCard,
  SearchBar,
  PassengerList,
  ScannerModal,
  QRCodeModal,
  ValidationConfirmModal,
} from './components/validation';

export default function App() {
  const {
    activeLine,
    authError,
    authReady,
    availableLines,
    driver,
    filteredPassengers,
    handleBarCodeScanned,
    hasPermission,
    isPassValid,
    lastSyncAt,
    loading,
    login,
    loginLoading,
    logout,
    pendingSyncCount,
    refreshCache,
    requestCameraPermission,
    scannerActive,
    searchTerm,
    selectedPassenger,
    setActiveLine,
    setScannerActive,
    setSearchTerm,
    setSelectedPassenger,
    showQRCode,
    setShowQRCode,
    syncStatus,
    todayValidations,
    validatePass,
  } = useValidationApp();

  const openScanner = async () => {
    if (!hasPermission && requestCameraPermission) {
      await requestCameraPermission();
    }
    setScannerActive(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={validationStyles.loadingContainer}>
        <Text style={validationStyles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (authReady && !driver) {
    return (
      <SafeAreaView style={validationStyles.container}>
        <DriverLoginScreen
          error={authError}
          loading={loginLoading}
          onLogin={login}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={validationStyles.container}>
      <Header
        activeLine={activeLine}
        availableLines={availableLines}
        driver={driver}
        lastSyncAt={lastSyncAt}
        onChangeLine={setActiveLine}
        onLogout={logout}
        onSyncPress={refreshCache}
        pendingSyncCount={pendingSyncCount}
        syncStatus={syncStatus}
      />

      <CounterCard count={todayValidations.length} />

      <View style={validationStyles.buttonRow}>
        <TouchableOpacity
          style={[validationStyles.actionButton, validationStyles.primaryButton]}
          onPress={openScanner}
        >
          <Text style={validationStyles.buttonText}>📷 Escanear QR Code</Text>
        </TouchableOpacity>
      </View>

      <SearchBar value={searchTerm} onChangeText={setSearchTerm} />

      <PassengerList
        searchTerm={searchTerm}
        filteredPassengers={filteredPassengers}
        todayValidations={todayValidations}
        isPassValid={isPassValid}
        onSelectPassenger={setSelectedPassenger}
        onShowQRCode={setShowQRCode}
      />

      <ScannerModal
        visible={scannerActive}
        hasPermission={hasPermission}
        onClose={() => setScannerActive(false)}
        onBarCodeScanned={handleBarCodeScanned}
      />

      <QRCodeModal
        visible={!!showQRCode}
        passenger={showQRCode}
        onClose={() => setShowQRCode(null)}
      />

      <ValidationConfirmModal
        visible={!!selectedPassenger}
        passenger={selectedPassenger}
        isPassValid={isPassValid}
        onCancel={() => setSelectedPassenger(null)}
        onConfirm={validatePass}
      />
    </SafeAreaView>
  );
}
