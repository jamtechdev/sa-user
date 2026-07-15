import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: { mobile?: string } | undefined;
  ForgotPassword: { mobile?: string } | undefined;
};

export type MainTabParamList = {
  MyBids: undefined;
  Passbook: undefined;
  Home: undefined;
  Funds: undefined;
  Support: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Games: { marketId: string; marketName: string };
  GamePlay: {
    marketId: string;
    marketName: string;
    gameId: string;
    gameName: string;
  };
  Deposit: undefined;
  Withdraw: undefined;
};
