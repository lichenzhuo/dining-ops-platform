<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <section class="screen-panel" :class="{ 'screen-panel--compact': compact }">
    <header class="screen-panel__head">
      <span class="screen-panel__title">{{ title }}</span>
      <div v-if="$slots.extra" class="screen-panel__extra">
        <slot name="extra" />
      </div>
    </header>
    <div class="screen-panel__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.screen-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(13, 42, 68, 0.92) 0%, rgba(7, 20, 38, 0.96) 100%);
  border: 1px solid $screen-border;
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px rgba(19, 194, 194, 0.06);

  &--compact {
    .screen-panel__head {
      padding: 8px 12px;
    }

    .screen-panel__body {
      padding: 0 12px 10px;
    }
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: $screen-text-primary;
    letter-spacing: 0.5px;

    &::before {
      display: inline-block;
      width: 3px;
      height: 12px;
      margin-right: 8px;
      vertical-align: -1px;
      content: '';
      background: $screen-accent;
      border-radius: 2px;
    }
  }

  &__body {
    flex: 1;
    min-height: 0;
    padding: 0 14px 12px;
    overflow: auto;
  }
}
</style>
