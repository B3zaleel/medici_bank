<template>
  <div :class="{ 'side-bar': true, visible: isOpen }" @click.self="closeBar">
    <div>
      <div>
        <button @click="closeBar" class="bar-btn">
          <Close />
        </button>
      </div>

      <div @mousedown="setActivePage">
        <router-link to="/" :class="{ page_link: true }">
          <Collage />
          <strong>Home</strong>
          <em class="signal"></em>
        </router-link>

        <router-link to="/services" :class="{ page_link: true }">
          <Bank />
          <strong>Services</strong>
          <em class="signal"></em>
        </router-link>

        <router-link to="/transactions" :class="{ page_link: true }">
          <Transfer />
          <strong>Transactions</strong>
          <em class="signal"></em>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Close from '@/assets/icons/Close.vue';
import Collage from '@/assets/icons/Collage.vue';
import Bank from '@/assets/icons/Bank.vue';
import Transfer from '@/assets/icons/Transfer.vue';

@Options({
  components: {
    Close,
    Collage,
    Bank,
    Transfer,
  },
})
export default class SideBar extends Vue {
  @Prop() isOpen!: boolean;

  closeBar(): void {
    this.$emit('request-close');
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/layout/side_bar';
</style>
