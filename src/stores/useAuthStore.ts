import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserInfo = {
  nickname: string;
  profileImageUrl: string;
};

type AuthState = {
  accessToken: string;
  refreshToken: string;
  nickname: string;
  profileImageUrl: string;
  setStateAccessToken: (accessToken: string) => void;
  setStateRefreshToken: (refreshToken: string) => void;
  setStateUserInfo: (userInfo: UserInfo) => void;
  clearUserState: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    set => ({
      accessToken: '',
      refreshToken: '',
      nickname: '',
      profileImageUrl: '',
      setStateAccessToken: (accessToken: string) => {
        set(() => ({ accessToken }));
      },
      setStateRefreshToken: (refreshToken: string) => {
        set(() => ({ refreshToken }));
      },
      setStateUserInfo: (userInfo: UserInfo) => {
        console.log(userInfo);
        set(state => ({
          ...state,
          ...userInfo,
        }));
      },
      clearUserState: () => {
        set({
          accessToken: '',
          refreshToken: '',
          nickname: '',
          profileImageUrl: '',
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
