<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="screen-kpi">
    <div v-for="item in items" :key="item.key" class="screen-kpi__item">
      <span class="screen-kpi__label">{{ item.label }}</span>
      <div class="screen-kpi__value-row">
        <strong>{{ item.value }}</strong>
        <em v-if="item.unit">{{ item.unit }}</em>
      </div>
      <span class="screen-kpi__trend" :class="item.up ? 'screen-kpi__trend--up' : 'screen-kpi__trend--down'">
        {{ item.trend }}
      </span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.screen-kpi {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  height: 96px;

  &__item {
    display: grid;
    gap: 4px;
    align-content: center;
    padding: 10px 14px;
    background: linear-gradient(180deg, rgba(19, 194, 194, 0.08), rgba(7, 20, 38, 0.4));
    border: 1px solid $screen-border;
    border-radius: 10px;
  }

  &__label {
    font-size: 12px;
    color: $screen-text-secondary;
  }

  &__value-row {
    display: flex;
    gap: 4px;
    align-items: baseline;

    strong {
      font-size: 22px;
      font-weight: 700;
      color: $screen-text-primary;
    }

    em {
      font-size: 11px;
      font-style: normal;
      color: $screen-text-secondary;
    }
  }

  &__trend {
    font-size: 11px;

    &--up {
      color: $color-success;
    }

    &--down {
      color: $color-danger;
    }
  }
}
</style>
