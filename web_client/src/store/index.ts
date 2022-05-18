import { createStore } from 'vuex';

export default createStore({
  state: {
    API_URL: 'https://medici-bank-api.herokuapp.com/graphql',
    // API_URL: 'http://localhost:3000/graphql',
    user: {
      isAuthenticated:
        window.localStorage.getItem('user.isAuthenticated') === 'true',
      authToken: window.localStorage.getItem('user.authToken') || '',
    },
  },
  mutations: {
    signIn(state, token: string): void {
      state.user.authToken = token;
      state.user.isAuthenticated = true;
      window.localStorage.setItem('user.authToken', token);
      window.localStorage.setItem('user.isAuthenticated', 'true');
    },
    signOut(state): void {
      state.user.authToken = '';
      state.user.isAuthenticated = false;
      window.localStorage.setItem('user.authToken', '');
      window.localStorage.setItem('user.isAuthenticated', 'false');
    },
  },
});
