<template>
  <div class="auth">
    <form @submit.prevent="signIn" class="auth-form">
      <h2>Access Your Account</h2>
      <input
        type="text"
        class="mb-inputtext-lg"
        placeholder="Phone/Account Number"
        v-model="phone"
      />
      <input
        type="password"
        class="mb-inputtext-lg"
        placeholder="Password"
        v-model="password"
      />

      <button class="mb-button-rounded">Sign In</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import AuthenticationAPIReq from '@/modules/api_requests/authentication';

@Options({})
export default class SignIn extends Vue {
  phone = '';
  password = '';
  isSigningIn = false;
  store = useStore();
  authenticationAPIReq = new AuthenticationAPIReq(this.store.state.API_URL);

  signIn(): void {
    this.isSigningIn = true;
    if (this.phone.trim().length > 0) {
      if (this.password.trim().length > 0) {
        this.authenticationAPIReq
          .signIn(this.phone, this.password)
          .then((res) => {
            if (res.__typename === 'AuthPayload') {
              this.store.commit('signIn', res.bearerToken);
              this.$router.push('/');
            } else {
              alert(res.message);
            }
            this.isSigningIn = false;
          })
          .catch((err) => {
            alert(err);
          });
      }
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/auth';
</style>
