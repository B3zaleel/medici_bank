<template>
  <div
    :class="{ menu: true, visible: isMenuOpen }"
    :style="positionStyle"
    @mousedown.stop="mouseDownEvent"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Position, PointerClickEvent } from '@/modules/types/interfaces';

@Options({
  name: 'ContextMenu',
  props: {
    isMenuOpen: false,
    position: { type: 'relative' },
  },
  computed: {
    positionStyle() {
      return {
        position: this.$props.position.type,
        left: this.$props.position.left || 'auto',
        top: this.$props.position.top || 'auto',
        right: this.$props.position.right || 'auto',
        bottom: this.$props.position.bottom || 'auto',
      };
    },
  },
})
export default class ContextMenu extends Vue {
  @Prop() isMenuOpen!: boolean;

  @Prop() position!: Position;

  mouseDownEvent(ev: PointerClickEvent) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  created(): void {
    window.addEventListener('mousedown', () => {
      this.$emit('request-close');
    });
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/layout/context_menu';
</style>
