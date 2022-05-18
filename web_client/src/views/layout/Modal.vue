<template>
  <div
    :class="{ 'modal-view': true, hidden: !modalOpen }"
    @mousedown.self="closeDialog"
  >
    <div>
      <div class="header">
        <div>
          <h3>{{ modalTitle }}</h3>
        </div>
        <div>
          <button @click="closeDialog" class="icon-btn">
            <CloseIcon />
          </button>
        </div>
      </div>

      <div class="content">
        <slot name="modal-body"></slot>
      </div>

      <div class="footer">
        <slot name="modal-action-panel"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import CloseIcon from '@/assets/icons/Close.vue';

@Options({
  components: {
    CloseIcon,
  },
})
export default class MainLayout extends Vue {
  @Prop() modalOpen!: boolean;

  @Prop() modalTitle!: string;

  @Prop() hasHeader!: boolean;

  @Prop() hasFooter!: boolean;

  closeDialog(ev: Event): void {
    this.$emit('request-close');
    ev.preventDefault();
    ev.stopPropagation();
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/layout/modal';
</style>
