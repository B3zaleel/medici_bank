<template>
  <div class="auth">
    <form @submit.prevent="deleteAccount" class="auth-form">
      <h2>Delete Your Account</h2>
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

      <button class="mb-button-rounded">Delete Account</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import UserAPIReq from '@/modules/api_requests/user';

@Options({})
export default class DeleteAccount extends Vue {
  phone = '';
  password = '';
  isDeletingAccount = false;
  store = useStore();
  userAPIReq = new UserAPIReq(
    this.store.state.API_URL,
    this.store.state.user.authToken,
  );

  deleteAccount(): void {
    this.isDeletingAccount = true;
    if (this.phone.trim().length > 0) {
      if (this.password.trim().length > 0) {
        this.userAPIReq
          .deleteUser(this.phone, this.password)
          .then((res) => {
            if (res.success) {
              this.store.commit('signOut');
              this.$router.push('/');
            } else {
              alert(res.message);
            }
            this.isDeletingAccount = false;
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
