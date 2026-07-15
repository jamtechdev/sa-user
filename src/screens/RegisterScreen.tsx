import React, { useEffect, useState } from 'react';
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
import { colors, fonts } from '../theme';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;
type Step = 'phone' | 'otp' | 'password';

export default function RegisterScreen({ navigation, route }: Props) {
  const { checkPhone, sendOtp, verifyOtp, completeSignup } = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState(route.params?.mobile || '');
  const [otp, setOtp] = useState('');
  const [otpTicket, setOtpTicket] = useState('');
  const [password, setPassword] = useState('');
  const [hint, setHint] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (route.params?.mobile) {
      setMobile(route.params.mobile);
      void startSignup(route.params.mobile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSignup = async (phone: string) => {
    setError('');
    setSubmitting(true);
    const check = await checkPhone(phone);
    if (typeof check === 'string') {
      setSubmitting(false);
      setError(check);
      return;
    }
    if (check.exists) {
      setSubmitting(false);
      setError('Number already registered — login with password');
      return;
    }
    const sent = await sendOtp(phone, 'signup');
    setSubmitting(false);
    if (typeof sent === 'string') {
      setError(sent);
      return;
    }
    if (sent.debugOtp) setHint(`Dev OTP: ${sent.debugOtp}`);
    setStep('otp');
  };

  const onSendOtp = async () => {
    await startSignup(mobile.trim());
  };

  const onVerify = async () => {
    setError('');
    setSubmitting(true);
    const res = await verifyOtp(mobile, otp, 'signup');
    setSubmitting(false);
    if (typeof res === 'string') {
      setError(res);
      return;
    }
    setOtpTicket(res.otpTicket);
    setStep('password');
  };

  const onCreate = async () => {
    setError('');
    setSubmitting(true);
    const err = await completeSignup({
      phone: mobile.trim(),
      otpTicket,
      password,
      name: name.trim() || undefined,
    });
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
        <Animated.View entering={FadeInDown.duration(400)} style={styles.form}>
          <Text style={styles.title}>
            {step === 'phone'
              ? 'Sign up'
              : step === 'otp'
                ? 'Verify OTP'
                : 'Create password'}
          </Text>

          {step === 'phone' ? (
            <>
              <Text style={styles.label}>Mobile</Text>
              <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                placeholder="10-digit mobile"
                placeholderTextColor={colors.textDim}
                keyboardType="number-pad"
                maxLength={10}
              />
            </>
          ) : null}

          {step === 'otp' ? (
            <>
              <Text style={styles.sub}>OTP bheja gaya · {mobile}</Text>
              {hint ? <Text style={styles.hint}>{hint}</Text> : null}
              <Text style={styles.label}>OTP</Text>
              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                placeholder="6-digit OTP"
                placeholderTextColor={colors.textDim}
                keyboardType="number-pad"
                maxLength={6}
              />
              <Pressable onPress={onSendOtp}>
                <Text style={styles.linkBold}>Resend OTP</Text>
              </Pressable>
            </>
          ) : null}

          {step === 'password' ? (
            <>
              <Text style={styles.label}>Name (optional)</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.textDim}
                autoCapitalize="words"
              />
              <Text style={styles.label}>Create password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Min 4 characters"
                placeholderTextColor={colors.textDim}
                secureTextEntry
              />
            </>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}
            onPress={
              step === 'phone'
                ? onSendOtp
                : step === 'otp'
                  ? onVerify
                  : onCreate
            }
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Text style={styles.buttonText}>
                {step === 'phone'
                  ? 'Send OTP'
                  : step === 'otp'
                    ? 'Verify'
                    : 'Create account'}
              </Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>
              Already have account? <Text style={styles.linkBold}>Login</Text>
            </Text>
          </Pressable>
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
  },
  form: { gap: 10 },
  title: {
    color: colors.text,
    fontFamily: fonts.displaySemi,
    fontSize: 24,
    marginBottom: 6,
  },
  sub: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  hint: {
    color: colors.gold,
    fontFamily: fonts.semi,
    fontSize: 13,
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
  error: {
    color: colors.danger,
    fontFamily: fonts.medium,
    fontSize: 13,
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
