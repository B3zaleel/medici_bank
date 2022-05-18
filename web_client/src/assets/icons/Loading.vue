<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    id="mdi-loading"
    class="mdi-loading"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
  </svg>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Loading extends Vue {}
</script>

<style lang="scss">
.mdi-loading {
  > path {
    transform-origin: center center;
    animation-name: loading-anim;
    animation-fill-mode: forwards;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-play-state: running;
  }
}

@keyframes loading-anim {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
