import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { validationStyles } from '../../styles/validationStyles';

export function DriverLoginScreen({ error, loading, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    await onLogin(email.trim(), password);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Entrar como motorista</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="E-mail"
          placeholderTextColor="#94a3b8"
          style={styles.input}
          value={email}
        />
        <TextInput
          onChangeText={setPassword}
          placeholder="Senha"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          style={styles.input}
          value={password}
        />

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={loading || !email || !password}
          onPress={handleSubmit}
          style={[
            validationStyles.actionButton,
            validationStyles.primaryButton,
            styles.button,
            (loading || !email || !password) && validationStyles.primaryButtonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={validationStyles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f4f7fb',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 20,
  },
  error: {
    color: '#dc2626',
    fontSize: 13,
    marginBottom: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
});
