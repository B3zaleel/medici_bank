<template>
  <header id="site-header">
    <div>
      <button @click.prevent="openSideBar" class="icon-btn">
        <Menu />
      </button>
      <router-link to="/" class="home-link">Medici Bank</router-link>
    </div>
    <div>
      <button @click.prevent="openMoreMenu" class="icon-btn">
        <DotsHexagon />
      </button>
    </div>
  </header>
  <SideBar :isOpen="isSideBarOpen" v-on:request-close="closeSideBar"></SideBar>

  <main>
    <div class="menu-container">
      <ContextMenu
        :position="moreMenuPos"
        :isMenuOpen="isMoreMenuOpen"
        v-on:request-close="closeMoreMenu"
      >
        <div>
          <div class="info-sect">
            <router-link class="menu-item" to="/about">About</router-link>
          </div>
          <div v-show="!isAuthenticated()">
            <router-link class="menu-item" to="/sign-up">Sign Up</router-link>
            <router-link class="menu-item" to="/sign-in">Sign In</router-link>
          </div>
          <div v-show="isAuthenticated()">
            <button class="menu-item" @click="signOut">Sign Out</button>
            <router-link class="menu-item danger" to="/delete-account">
              Delete Account
            </router-link>
          </div>
        </div>
      </ContextMenu>
    </div>
    <router-view />
  </main>

  <footer>
    <div>
      <router-link to="/about" class="text">About</router-link>
    </div>
    <div>&copy; {{ new Date().getFullYear() }} Medici Bank</div>
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import DotsHexagon from '@/assets/icons/DotsHexagon.vue';
import Menu from '@/assets/icons/Menu.vue';
import ContextMenu from '@/views/layout/ContextMenu.vue';
import SideBar from '@/views/layout/SideBar.vue';
import { Position } from '@/modules/types/interfaces';

@Options({
  components: {
    DotsHexagon,
    Menu,
    ContextMenu,
    SideBar,
  },
})
export default class App extends Vue {
  isMoreMenuOpen = false;
  isSideBarOpen = false;
  moreMenuPos: Position = {
    type: 'fixed',
    right: '0',
    top: '0',
  };
  store = useStore();

  isAuthenticated() {
    return this.store.state.user.isAuthenticated;
  }

  openMoreMenu(): void {
    const header = document.getElementById('site-header');
    this.moreMenuPos.right = `${15}px`;
    this.moreMenuPos.top = `${(header?.clientHeight || 0) - 5}px`;
    this.isMoreMenuOpen = true;
  }

  closeMoreMenu(): void {
    this.isMoreMenuOpen = false;
  }

  openSideBar(): void {
    if (this.isAuthenticated()) {
      this.isSideBarOpen = true;
    }
  }

  closeSideBar(): void {
    this.isSideBarOpen = false;
  }

  signOut(): void {
    this.store.commit('signOut');
    this.$router.push('/');
    window.location.reload();
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/app';
</style>
