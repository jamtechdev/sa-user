import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import CrossPattern from '../components/CrossPattern';
import BrandLogo from '../components/BrandLogo';
import { colors, fonts } from '../theme';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type Step = 'phone' | 'password';

export default function LoginScreen({ navigation }: Props) {
  const { checkPhone, loginWithPassword } = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onContinuePhone = async () => {
    setError('');
    setSubmitting(true);
    const res = await checkPhone(mobile);
    setSubmitting(false);
    if (typeof res === 'string') {
      setError(res);
      return;
    }
    if (res.exists && res.next === 'password') {
      setStep('password');
      return;
    }
    navigation.navigate('Register', { mobile: mobile.trim() });
  };

  const onLogin = async () => {
    setError('');
    setSubmitting(true);
    const err = await loginWithPassword(mobile, password);
    setSubmitting(false);
    if (err) setError(err);
  };

  return (
    <View style={styles.root}>
      <CrossPattern />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View entering={FadeInDown.duration(420)} style={styles.hero}>
          <BrandLogo size={88} />
          <Text style={styles.brand}>SARA 567</Text>
          <Text style={styles.tag}>Play & Win Big</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(80).duration(420)}
          style={styles.form}
        >
          <Text style={styles.title}>
            {step === 'phone' ? 'Enter mobile' : 'Enter password'}
          </Text>

          <Text style={styles.label}>Mobile</Text>
          <TextInput
            style={[styles.input, step === 'password' && styles.inputLocked]}
            value={mobile}
            onChangeText={setMobile}
            placeholder="10-digit mobile"
            placeholderTextColor={colors.textDim}
            keyboardType="number-pad"
            maxLength={10}
            editable={step === 'phone'}
          />

          {step === 'password' ? (
            <>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={colors.textDim}
                secureTextEntry
              />
              <Pressable
                onPress={() =>
                  navigation.navigate('ForgotPassword', {
                    mobile: mobile.trim(),
                  })
                }
              >
                <Text style={styles.forgot}>Forgot password?</Text>
              </Pressable>
            </>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}
            onPress={step === 'phone' ? onContinuePhone : onLogin}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Text style={styles.buttonText}>
                {step === 'phone' ? 'Continue' : 'Login'}
              </Text>
            )}
          </Pressable>

          {step === 'password' ? (
            <Pressable
              onPress={() => {
                setStep('phone');
                setPassword('');
                setError('');
              }}
            >
              <Text style={styles.link}>Change number</Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => navigation.navigate('Register', {})}>
              <Text style={styles.link}>
                New here? <Text style={styles.linkBold}>Sign up</Text>
              </Text>
            </Pressable>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    gap: 28,
  },
  hero: { alignItems: 'center', gap: 8 },
  brand: {
    color: colors.gold,
    fontFamily: fonts.displayExtra,
    fontSize: 34,
    letterSpacing: 1,
  },
  tag: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  form: { gap: 10 },
  title: {
    color: colors.text,
    fontFamily: fonts.displaySemi,
    fontSize: 24,
    marginBottom: 6,
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.semi,
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 16,
  },
  inputLocked: { opacity: 0.75 },
  forgot: {
    color: colors.gold,
    fontFamily: fonts.semi,
    fontSize: 13,
    textAlign: 'right',
    marginTop: 2,
  },
  error: {
    color: colors.danger,
    fontFamily: fonts.medium,
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    marginTop: 10,
    backgroundColor: colors.gold,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.bg,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  link: {
    marginTop: 14,
    textAlign: 'center',
    color: colors.textMuted,
    fontFamily: fonts.medium,
  },
  linkBold: { color: colors.gold, fontFamily: fonts.bold },
});
