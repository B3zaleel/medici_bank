<template>
  <div class="home">
    <div :class="{ 'guest-panel': true, visible: !isAuthenticated() }">
      <h2>Welcome to Medici Bank</h2>
      <div class="cta-panel">
        <strong>Want to join us?</strong>
        <router-link to="/sign-up" class="mb-button-rounded"
          >Sign Up
        </router-link>
        <strong>Already have an account?</strong>
        <router-link to="/sign-in" class="mb-button-rounded"
          >Sign In
        </router-link>
      </div>
    </div>

    <div :class="{ 'user-panel': true, visible: isAuthenticated() }">
      <div class="profile-info">
        <AccountCircle />
        <strong class="name">{{ name }}</strong>
        <strong class="balance">&#x20A6; {{ balance / 100 }}</strong>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import AccountCircle from '@/assets/icons/AccountCircle.vue';
import Naira from '@/assets/icons/Naira.vue';
import UserAPIReq from '@/modules/api_requests/user';

@Options({
  components: {
    AccountCircle,
    Naira,
  },
})
export default class Home extends Vue {
  store = useStore();
  userAPIReq = new UserAPIReq(
    this.store.state.API_URL,
    this.store.state.user.authToken,
  );
  name = '';
  balance = 0;

  isAuthenticated() {
    return this.store.state.user.isAuthenticated;
  }

  loadUserInfo(): void {
    this.userAPIReq.getUser().then((res) => {
      if (res.__typename === 'User') {
        this.name = res.name;
        this.balance = res.balance;
      }
    });
  }

  mounted() {
    if (this.isAuthenticated()) {
      this.loadUserInfo();
    }
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/home';
</style>
