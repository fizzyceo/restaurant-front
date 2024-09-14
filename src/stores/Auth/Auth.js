import { create } from 'zustand';
import { SignJWT, jwtVerify } from 'jose';
import { axiosHelper, tokenHelper } from '../helpers';
import { setCookie, getCookie, removeCookie } from '../../helpers/cookies'; // Adjust the path
import { encrypt } from '../../helpers/sessions';

// Secret key and key encoding
const secretKey = 'basseer-internship';
const key = new TextEncoder().encode(secretKey);


export const useAuth = create((set) => ({
  user: tokenHelper.getUser(),
  accessToken: tokenHelper.getToken(),
  isLoading: null,
  error: null,
  errorMsg: null,

  login: async (data, router) => {
    set({ isLoading: true, errorMsg: null });
    try {
      const response = await axiosHelper.post('/user/auth', JSON.stringify(data));
      // if (response.status !== 201 && response.status !== 200) {
      //   set({ errorMsg: response.message });
      //   return;
      // }
      const response2 = await axiosHelper.get('/user/infos',{
        Authorization: response.accessToken
      });
      
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      const session = await encrypt({ accessToken: response.accessToken, expiresAt,user:response2  }); //user:response2.
      
      setCookie('session', session, {
        expires: expiresAt,
        secure: true,
        sameSite: 'lax',
      });

      // tokenHelper.setToken(response.accessToken);
      // tokenHelper.setUser(response.data);
      // set({ user: response.data, accessToken: response.accessToken });
      navigateAfterLogin(null, router);
    } catch (error) {
      console.log(error.status, error.message);
      set({ errorMsg: 'Invalid Credentials' });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    removeCookie('session');
    tokenHelper.removeToken();
    tokenHelper.removeUser();
  },

  resetPassword: async (newPassword, router) => {
    try {
      set({ isLoading: true });
      const response = await axiosHelper.put('/auth/system/reset-password', {
        password: newPassword,
      });
      if (response.result) {
        set((state) => ({ ...state, user: { ...state.user, tempPassword: false } }));
        router.navigate('/');
      }
    } catch (error) {
      console.log(error);
      // router.navigate("/login");
    } finally {
      set({ isLoading: false });
    }
  },
}));

const navigateAfterLogin = (tempPassword, router) => {
  console.log(router);
  
  router.navigate('/');
};
