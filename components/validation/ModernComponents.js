/**
 * Reusable Modern Components Library
 * Ready-to-use components with modern design
 */

import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { validationStyles, SPACING } from '../../styles/validationStyles';
import { Colors } from '../../constants/theme';

/**
 * Modern Button Component
 * Supports multiple variants and states
 */
export function ModernButton({
  title,
  icon,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
}) {
  const variantStyles = {
    primary: validationStyles.primaryButton,
    secondary: { borderWidth: 1.5, borderColor: Colors.light.border },
    danger: { backgroundColor: Colors.light.error },
    success: { backgroundColor: Colors.light.success },
  };

  const sizeStyles = {
    sm: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
    md: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
    lg: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl },
  };

  const textColors = {
    primary: '#fff',
    secondary: Colors.light.text,
    danger: '#fff',
    success: '#fff',
  };

  return (
    <TouchableOpacity
      style={[
        validationStyles.actionButton,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && { width: '100%' },
        disabled && validationStyles.primaryButtonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <>
          {icon && <Text style={[validationStyles.buttonIcon]}>{icon}</Text>}
          <Text style={[validationStyles.buttonText, { color: textColors[variant] }]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

/**
 * Badge Component
 * Display status or category labels
 */
export function Badge({
  label,
  variant = 'primary',
  icon,
  size = 'md',
}) {
  const variantColors = {
    primary: {
      bg: Colors.light.primaryLight,
      text: Colors.light.primary,
    },
    success: {
      bg: Colors.light.successLight,
      text: Colors.light.success,
    },
    error: {
      bg: Colors.light.errorLight,
      text: Colors.light.error,
    },
    warning: {
      bg: Colors.light.warningLight,
      text: Colors.light.warning,
    },
  };

  const sizeStyles = {
    sm: {
      paddingHorizontal: SPACING.sm,
      paddingVertical: 2,
      fontSize: 11,
    },
    md: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
      fontSize: 12,
    },
    lg: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      fontSize: 14,
    },
  };

  const colors = variantColors[variant];
  const size_style = sizeStyles[size];

  return (
    <View
      style={[
        validationStyles.badge,
        {
          backgroundColor: colors.bg,
          paddingHorizontal: size_style.paddingHorizontal,
          paddingVertical: size_style.paddingVertical,
        },
      ]}
    >
      <Text
        style={[
          validationStyles.badgeText,
          {
            color: colors.text,
            fontSize: size_style.fontSize,
          },
        ]}
      >
        {icon && `${icon} `}
        {label}
      </Text>
    </View>
  );
}

/**
 * Status Card Component
 * Display status with icon and message
 */
export function StatusCard({
  title,
  message,
  status = 'success',
  icon,
  action,
}) {
  const statusColors = {
    success: {
      bg: Colors.light.successLight,
      border: Colors.light.success,
      text: Colors.light.success,
    },
    error: {
      bg: Colors.light.errorLight,
      border: Colors.light.error,
      text: Colors.light.error,
    },
    warning: {
      bg: Colors.light.warningLight,
      border: Colors.light.warning,
      text: Colors.light.warning,
    },
    info: {
      bg: Colors.light.infoLight,
      border: Colors.light.info,
      text: Colors.light.info,
    },
  };

  const colors = statusColors[status];

  return (
    <View
      style={[
        validationStyles.validCard,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
      ]}
    >
      {icon && (
        <Text style={{ fontSize: 40, marginBottom: SPACING.md }}>
          {icon}
        </Text>
      )}
      <Text
        style={[
          validationStyles.validCardTitle,
          { color: colors.text },
        ]}
      >
        {title}
      </Text>
      {message && (
        <Text
          style={[
            validationStyles.validCardText,
            { color: colors.text, marginTop: SPACING.sm },
          ]}
        >
          {message}
        </Text>
      )}
      {action && <View style={{ marginTop: SPACING.lg }}>{action}</View>}
    </View>
  );
}

/**
 * Empty State Component
 * Display when no content is available
 */
export function EmptyState({
  icon,
  title,
  message,
  action,
}) {
  return (
    <View style={validationStyles.emptyContainer}>
      {icon && (
        <Text style={validationStyles.emptyIcon}>
          {icon}
        </Text>
      )}
      {title && (
        <Text style={validationStyles.emptyText}>
          {title}
        </Text>
      )}
      {message && (
        <Text style={validationStyles.emptySubtext}>
          {message}
        </Text>
      )}
      {action && (
        <View style={{ marginTop: SPACING.lg }}>
          {action}
        </View>
      )}
    </View>
  );
}

/**
 * Info Card Component
 * Display information with label and value
 */
export function InfoCard({
  items,
  variant = 'light',
}) {
  const bgColor = variant === 'light'
    ? Colors.light.backgroundSecondary
    : '#fff';

  return (
    <View
      style={[
        validationStyles.qrDetails,
        { backgroundColor: bgColor },
      ]}
    >
      {items.map((item, index) => (
        <View
          key={index}
          style={[
            validationStyles.qrDetailRow,
            index !== items.length - 1 && {
              borderBottomWidth: 1,
              borderBottomColor: Colors.light.border,
              paddingBottom: SPACING.md,
              marginBottom: SPACING.md,
            },
          ]}
        >
          <Text style={validationStyles.qrDetailLabel}>
            {item.label}
          </Text>
          <Text style={validationStyles.qrDetailValue}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Divider Component
 * Visual separator
 */
export function Divider({
  style,
  color = Colors.light.border,
  thickness = 1,
  margin = SPACING.lg,
}) {
  return (
    <View
      style={[
        {
          height: thickness,
          backgroundColor: color,
          marginVertical: margin,
        },
        style,
      ]}
    />
  );
}

/**
 * Spinner/Loader Component
 */
export function Loader({
  size = 'large',
  color = Colors.light.primary,
  message,
}) {
  return (
    <View
      style={[
        validationStyles.permissionContainer,
        {
          backgroundColor: 'transparent',
        },
      ]}
    >
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text
          style={{
            marginTop: SPACING.lg,
            color: Colors.light.text,
            fontSize: 14,
            fontWeight: '500',
          }}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

export default {
  ModernButton,
  Badge,
  StatusCard,
  EmptyState,
  InfoCard,
  Divider,
  Loader,
};
