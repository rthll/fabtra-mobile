import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { validationStyles } from '../../styles/validationStyles';

const formatLastSync = (value) => {
  if (!value) {
    return 'Sem sync anterior';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Sem sync anterior';
  }

  return `Ultima sync ${parsed.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

export function Header({
  activeLine,
  availableLines = [],
  driver,
  lastSyncAt,
  pendingSyncCount,
  syncStatus,
  onChangeLine,
  onLogout,
  onSyncPress,
}) {
  const statusLabel = syncStatus === 'syncing'
    ? 'Sincronizando'
    : syncStatus === 'paused'
      ? 'Sincronizacao pausada'
      : pendingSyncCount > 0
        ? `${pendingSyncCount} pendente(s)`
        : 'Sincronizado';

  return (
    <View style={validationStyles.header}>
      <View style={validationStyles.headerContent}>
        <Text style={validationStyles.headerTitle}>Validacao de Passes</Text>
        <Text style={validationStyles.headerSubtitle}>
          {driver?.name || 'Motorista'} • {activeLine || 'Linha nao definida'}
        </Text>
        {availableLines.length > 1 && (
          <View style={validationStyles.lineSelectorRow}>
            {availableLines.map((line) => {
              const selected = line === activeLine;

              return (
                <TouchableOpacity
                  key={line}
                  onPress={() => onChangeLine?.(line)}
                  style={[
                    validationStyles.lineSelectorChip,
                    selected && validationStyles.lineSelectorChipActive,
                  ]}
                >
                  <Text
                    style={[
                      validationStyles.lineSelectorChipText,
                      selected && validationStyles.lineSelectorChipTextActive,
                    ]}
                  >
                    {line}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View style={validationStyles.headerMetaRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={syncStatus === 'syncing'}
            onPress={onSyncPress}
            style={[
              validationStyles.syncBadge,
              pendingSyncCount > 0 && validationStyles.syncBadgeOffline,
              syncStatus === 'syncing' && validationStyles.syncBadgeSyncing,
              syncStatus === 'paused' && validationStyles.syncBadgePaused,
            ]}
          >
            <Text style={validationStyles.syncBadgeText}>{statusLabel}</Text>
            <Text style={validationStyles.syncBadgeSubtext}>{formatLastSync(lastSyncAt)}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={onLogout} style={validationStyles.logoutPill}>
        <Text style={validationStyles.logoutPillText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
