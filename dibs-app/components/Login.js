import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <Feather name="globe" size={60} color={theme.primary} style={styles.icon} />
        <Text style={styles.logoText}>DIBS<Text style={styles.logoDot}>.</Text></Text>
        <Text style={styles.tagline}>Gamify the Circular Economy</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <Feather name="user" size={20} color={theme.subText} style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            placeholder="Username (Demo)" 
            placeholderTextColor={theme.subText}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Feather name="lock" size={20} color={theme.subText} style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            placeholderTextColor={theme.subText}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
          <Text style={styles.loginButtonText}>Enter Neighborhood</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 50 },
  icon: { marginBottom: 10 },
  logoText: { fontSize: 48, fontWeight: '900', color: theme.text, letterSpacing: -2 },
  logoDot: { color: theme.primary },
  tagline: { color: theme.subText, fontSize: 16, marginTop: 5 },
  formContainer: { width: '100%', gap: 15 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 12, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: theme.border },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: theme.text, fontSize: 16 },
  loginButton: { backgroundColor: theme.primary, height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});