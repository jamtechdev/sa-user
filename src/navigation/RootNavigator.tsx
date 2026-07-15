import React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import JazzTabBar from '../components/JazzTabBar';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import MarketsScreen from '../screens/MarketsScreen';
import GamesScreen from '../screens/GamesScreen';
import GamePlayScreen from '../screens/GamePlayScreen';
import DepositScreen from '../screens/DepositScreen';
import WithdrawScreen from '../screens/WithdrawScreen';
import MyBidsScreen from '../screens/MyBidsScreen';
import PassbookScreen from '../screens/PassbookScreen';
import FundsScreen from '../screens/FundsScreen';
import SupportScreen from '../screens/SupportScreen';
import { colors, fonts } from '../theme';
import type {
  AuthStackParamList,
  AppStackParamList,
  MainTabParamList,
} from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.text,
    border: colors.cardBorder,
    primary: colors.gold,
  },
};

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <JazzTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        freezeOnBlur: true,
      }}
    >
      <Tab.Screen name="MyBids" component={MyBidsScreen} />
      <Tab.Screen name="Passbook" component={PassbookScreen} />
      <Tab.Screen name="Home" component={MarketsScreen} />
      <Tab.Screen name="Funds" component={FundsScreen} />
      <Tab.Screen name="Support" component={SupportScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgElevated },
        headerShadowVisible: false,
        headerTintColor: colors.gold,
        headerTitleStyle: {
          color: colors.text,
          fontFamily: fonts.displaySemi,
          fontSize: 17,
        },
        contentStyle: { backgroundColor: colors.bg },
        animation: 'slide_from_right',
        animationDuration: 260,
      }}
    >
      <AppStack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <AppStack.Screen name="Games" component={GamesScreen} options={{ title: 'Games' }} />
      <AppStack.Screen
        name="GamePlay"
        component={GamePlayScreen}
        options={({ route }) => ({ title: route.params.gameName })}
      />
      <AppStack.Screen
        name="Deposit"
        component={DepositScreen}
        options={{ title: 'Deposit', presentation: 'modal' }}
      />
      <AppStack.Screen
        name="Withdraw"
        component={WithdrawScreen}
        options={{ title: 'Withdraw', presentation: 'modal' }}
      />
    </AppStack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen label="Getting ready…" />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
