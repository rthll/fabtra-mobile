import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { formatValidationTimestamp } from '../../services/firebaseService';
import { validationStyles } from '../../styles/validationStyles';
import { PassengerCard } from './PassengerCard';

export function PassengerList({
  searchTerm,
  filteredPassengers,
  todayValidations,
  isPassValid,
  onSelectPassenger,
  onShowQRCode,
}) {
  if (searchTerm && filteredPassengers.length > 0) {
    return (
      <ScrollView
        style={validationStyles.listContainer}
        contentContainerStyle={validationStyles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={validationStyles.sectionTitle}>
          🔍 Resultados da Busca ({filteredPassengers.length})
        </Text>
        {filteredPassengers.map((passenger) => (
          <PassengerCard
            key={passenger.id}
            passenger={passenger}
            isValid={isPassValid(passenger)}
            onValidate={() => onSelectPassenger(passenger)}
            onShowQR={() => onShowQRCode(passenger)}
          />
        ))}
      </ScrollView>
    );
  }

  if (searchTerm) {
    return (
      <ScrollView
        style={validationStyles.listContainer}
        contentContainerStyle={validationStyles.listContent}
      >
        <View style={validationStyles.emptyContainer}>
          <Text style={validationStyles.emptyIcon}>🔍</Text>
          <Text style={validationStyles.emptyText}>Nenhum passageiro encontrado</Text>
          <Text style={validationStyles.emptySubtext}>
            Tente buscar por outro nome ou código
          </Text>
        </View>
      </ScrollView>
    );
  }

  const validationsOrdenadas = [...todayValidations].sort(
    (a, b) => (formatValidationTimestamp(b)?.getTime() || 0) - (formatValidationTimestamp(a)?.getTime() || 0)
  );

  return (
    <ScrollView
      style={validationStyles.listContainer}
      contentContainerStyle={validationStyles.listContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={validationStyles.sectionTitle}>
        📋 Últimas Validações ({validationsOrdenadas.length})
      </Text>

      {validationsOrdenadas.length === 0 ? (
        <View style={validationStyles.emptyContainer}>
          <Text style={validationStyles.emptyIcon}>📭</Text>
          <Text style={validationStyles.emptyText}>Nenhuma validação até agora</Text>
          <Text style={validationStyles.emptySubtext}>
            Use a busca acima ou escaneie um QR Code para validar passes
          </Text>
        </View>
      ) : (
        validationsOrdenadas.map((validation) => {
          const waitingForPassenger = validation.queueType === 'qr-lookup';
          const statusColor = waitingForPassenger
            ? '#ffa502'
            : validation.valid ? '#1fad5d' : '#ff4757';
          const statusBackground = waitingForPassenger
            ? '#fef3e6'
            : validation.valid ? '#ecf9f3' : '#ffe8eb';
          const statusLabel = waitingForPassenger
            ? '...'
            : validation.valid ? '✓' : '✗';

          return (
            <View
              key={validation.validationId}
              style={[
                validationStyles.validationCard,
                {
                  borderLeftColor: statusColor,
                },
              ]}
            >
              <View style={validationStyles.validationContent}>
                <Text style={validationStyles.validationName}>
                  {validation.passengerName}
                </Text>
                <Text style={validationStyles.validationTime}>
                  ⏰ {formatValidationTimestamp(validation)?.toLocaleTimeString('pt-BR') || '--:--'}
                </Text>
                {validation.pendingSync ? (
                  <Text style={validationStyles.pendingValidationText}>
                    {validation.syncStatus === 'failed' && validation.syncError
                      ? validation.syncError
                      : waitingForPassenger ? 'Aguardando dados do passageiro' : 'Aguardando sincronização'}
                  </Text>
                ) : null}
              </View>
              <View style={[
                validationStyles.validationStatus,
                {
                  backgroundColor: statusBackground,
                },
              ]}>
                <Text
                  style={{
                    fontSize: 18,
                    color: statusColor,
                    fontWeight: '700',
                  }}
                >
                  {statusLabel}
                </Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
