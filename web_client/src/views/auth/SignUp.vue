<template>
  <div class="auth">
    <form @submit.prevent="signUp" class="auth-form">
      <h2>Create An Account</h2>
      <input
        type="text"
        class="mb-inputtext-lg"
        placeholder="Name"
        v-model="name"
      />
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

      <button class="mb-button-rounded">Sign Up</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import AuthenticationAPIReq from '@/modules/api_requests/authentication';

@Options({})
export default class SignUp extends Vue {
  name = '';
  phone = '';
  password = '';
  isSigningIn = false;
  store = useStore();
  authenticationAPIReq = new AuthenticationAPIReq(this.store.state.API_URL);

  signUp(): void {
    if (this.phone.trim().length > 0) {
      if (this.password.trim().length > 0) {
        this.authenticationAPIReq
          .signUp(this.name, this.phone, this.password)
          .then((res) => {
            if (res.__typename === 'AuthPayload') {
              this.store.commit('signIn', res.bearerToken);
              this.$router.push('/');
            } else {
              alert(res.message);
            }
          });
      }
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/auth';
</style>
