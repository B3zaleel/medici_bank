<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <div></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import HelloWorld from '@/components/HelloWorld.vue';

@Options({
  components: {
    HelloWorld,
  },
})
export default class HomeView extends Vue {
  items = [
    {
      label: 'Services',
      icon: '',
    },
  ];
}
</script>

<style lang="scss">
//
</style>
