import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

/**
 * Modern Validation Styles
 * Updated design system with:
 * - Elevated cards with shadows
 * - Consistent spacing (8px grid)
 * - Modern border radius (12-16px)
 * - Contemporary color palette
 * - Interactive states
 */

// Spacing System (8px grid)
const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Border radius system
const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};

export const validationStyles = StyleSheet.create({
  // ============ CONTAINER & LAYOUT ============
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  containerDark: {
    backgroundColor: Colors.dark.backgroundSecondary,
  },

  // ============ LOADING STATE ============
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingSpinner: {
    marginBottom: SPACING.lg,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  loadingSubtext: {
    color: Colors.light.primaryLight,
    fontSize: 14,
    marginTop: SPACING.sm,
  },

  // ============ HEADER ============
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '500',
  },
  headerMetaRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  lineSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  lineSelectorChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  lineSelectorChipActive: {
    backgroundColor: '#ffffff',
  },
  lineSelectorChipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  lineSelectorChipTextActive: {
    color: Colors.light.primary,
  },
  headerIcon: {
    fontSize: 32,
    marginLeft: SPACING.md,
  },
  syncBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  syncBadgeOffline: {
    backgroundColor: 'rgba(245, 158, 11, 0.22)',
  },
  syncBadgeSyncing: {
    backgroundColor: 'rgba(14, 165, 233, 0.22)',
  },
  syncBadgePaused: {
    backgroundColor: 'rgba(148, 163, 184, 0.22)',
  },
  syncBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  syncBadgeSubtext: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  logoutPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginLeft: SPACING.md,
  },
  logoutPillText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  // ============ COUNTER CARD ============
  counterCard: {
    backgroundColor: '#fff',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  counterContent: {
    flex: 1,
  },
  counterLabel: {
    color: Colors.light.textTertiary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  counterValue: {
    color: Colors.light.primary,
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 56,
  },
  counterIcon: {
    fontSize: 64,
    marginLeft: SPACING.lg,
    opacity: 0.2,
  },

  // ============ BUTTON ROW ============
  buttonRow: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  actionButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
  },
  primaryButtonPressed: {
    backgroundColor: '#0052cc',
    opacity: 0.9,
  },
  primaryButtonDisabled: {
    backgroundColor: Colors.light.border,
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  buttonIcon: {
    marginRight: SPACING.md,
    fontSize: 18,
  },

  // ============ SEARCH BAR ============
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    color: Colors.light.textTertiary,
    fontSize: 20,
    marginRight: SPACING.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: Colors.light.text,
  },
  searchClear: {
    color: Colors.light.textTertiary,
    fontSize: 18,
    padding: SPACING.sm,
  },

  // ============ LIST CONTAINER ============
  listContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },

  // ============ SECTION TITLE ============
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ============ PASSENGER CARD ============
  passengerCard: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  passengerCardValid: {
    borderLeftColor: Colors.light.success,
  },
  passengerCardInvalid: {
    borderLeftColor: Colors.light.error,
  },

  passengerInfo: {
    marginBottom: SPACING.md,
    paddingRight: SPACING.xxl,
  },
  passengerName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: SPACING.xs,
    lineHeight: 24,
  },
  passengerDetail: {
    color: Colors.light.textSecondary,
    fontSize: 13,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  passengerDetailLabel: {
    fontWeight: '700',
    color: Colors.light.text,
  },

  badge: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginTop: SPACING.md,
  },
  badgeText: {
    color: Colors.light.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  statusIcon: {
    position: 'absolute',
    right: SPACING.lg,
    top: SPACING.lg,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    backgroundColor: Colors.light.primaryLight,
  },
  validIcon: {
    color: Colors.light.success,
    fontSize: 24,
    backgroundColor: Colors.light.successLight,
  },
  invalidIcon: {
    color: Colors.light.error,
    fontSize: 24,
    backgroundColor: Colors.light.errorLight,
  },
  activeIcon: {
    color: Colors.light.info,
    backgroundColor: Colors.light.infoLight,
  },

  cardButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  validateButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  validateButtonPressed: {
    backgroundColor: '#0052cc',
    transform: [{ scale: 0.98 }],
  },
  validateButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  qrButton: {
    backgroundColor: Colors.light.backgroundSecondary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  qrButtonPressed: {
    backgroundColor: Colors.light.border,
  },
  qrButtonText: {
    color: Colors.light.text,
    fontWeight: '700',
    fontSize: 15,
  },

  // ============ EMPTY STATE ============
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
    opacity: 0.3,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.light.textTertiary,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: SPACING.md,
  },
  emptySubtext: {
    textAlign: 'center',
    color: Colors.light.textTertiary,
    fontSize: 13,
    marginHorizontal: SPACING.xl,
  },

  // ============ VALIDATION HISTORY ============
  validationCard: {
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.success,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  validationContent: {
    flex: 1,
  },
  validationName: {
    fontWeight: '700',
    fontSize: 15,
    color: Colors.light.text,
  },
  validationTime: {
    color: Colors.light.textSecondary,
    fontSize: 12,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  pendingValidationText: {
    color: '#b45309',
    fontSize: 12,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  validationStatus: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.md,
  },

  // ============ SCANNER ============
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scannerFrame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: Colors.light.primary,
    borderRadius: RADIUS.lg,
    backgroundColor: 'transparent',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  scannerCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: Colors.light.primary,
  },
  scannerCornerTL: {
    top: -3,
    left: -3,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  scannerCornerTR: {
    top: -3,
    right: -3,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  scannerCornerBL: {
    bottom: -3,
    left: -3,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  scannerCornerBR: {
    bottom: -3,
    right: -3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scannerText: {
    color: '#fff',
    fontSize: 16,
    marginTop: SPACING.xl,
    textAlign: 'center',
    fontWeight: '600',
  },
  scannerSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: Colors.light.error,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    marginTop: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: SPACING.md,
  },

  // ============ PERMISSION ============
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: '#fff',
  },
  permissionIcon: {
    fontSize: 80,
    marginBottom: SPACING.lg,
    opacity: 0.5,
  },
  permissionText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.md,
    color: Colors.light.text,
  },
  permissionSubtext: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.light.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  // ============ MODALS ============
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.xl,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.light.border,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: SPACING.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },

  // ============ QR CODE MODAL ============
  qrModal: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  qrName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    color: Colors.light.text,
  },
  qrCode: {
    color: Colors.light.textSecondary,
    fontSize: 13,
    marginBottom: SPACING.lg,
    fontWeight: '500',
  },
  qrCodeContainer: {
    padding: SPACING.lg,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  qrInfo: {
    color: Colors.light.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  qrDetails: {
    width: '100%',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  qrDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  qrDetailLabel: {
    color: Colors.light.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  qrDetailValue: {
    color: Colors.light.text,
    fontSize: 12,
    fontWeight: '700',
  },

  // ============ VALIDATION CONFIRM MODAL ============
  validationModal: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmText: {
    marginBottom: SPACING.md,
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  confirmLabel: {
    fontWeight: '700',
    color: Colors.light.text,
  },
  confirmValue: {
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },

  validCard: {
    backgroundColor: Colors.light.successLight,
    borderWidth: 2,
    borderColor: Colors.light.success,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.lg,
    alignItems: 'center',
  },
  invalidCard: {
    backgroundColor: Colors.light.errorLight,
    borderWidth: 2,
    borderColor: Colors.light.error,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.lg,
    alignItems: 'center',
  },
  validCardTitle: {
    color: Colors.light.success,
    fontWeight: '800',
    fontSize: 20,
    marginBottom: SPACING.sm,
  },
  invalidCardTitle: {
    color: Colors.light.error,
    fontWeight: '800',
    fontSize: 20,
    marginBottom: SPACING.sm,
  },
  validCardText: {
    color: Colors.light.success,
    fontSize: 16,
    fontWeight: '600',
  },
  invalidCardText: {
    color: Colors.light.error,
    fontSize: 16,
    fontWeight: '600',
  },
  validCardIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.light.border,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonPressed: {
    backgroundColor: Colors.light.backgroundSecondary,
  },
  cancelButtonText: {
    fontWeight: '700',
    color: Colors.light.text,
    fontSize: 15,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonPressed: {
    backgroundColor: '#0052cc',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // ============ STATE ANIMATIONS ============
  scaleSmall: {
    transform: [{ scale: 0.95 }],
  },
  opacityDim: {
    opacity: 0.6,
  },
});

// Export spacing for use in components
export { SPACING, RADIUS };
