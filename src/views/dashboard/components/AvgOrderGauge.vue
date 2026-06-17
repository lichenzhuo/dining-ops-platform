<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const gaugeOffset = 314 - Math.min(props.data.value / 120, 1) * 228
</script>

<template>
  <div class="panel-card chart-card chart-card--gauge">
    <div class="card-head">
      <h3>客单价</h3>
    </div>
    <div class="gauge">
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" stroke="#eef4f4" stroke-width="12" fill="none" />
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#13c2c2"
          stroke-width="12"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray="314"
          :stroke-dashoffset="gaugeOffset"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div class="gauge__center">
        <strong>{{ data.value.toFixed(1) }}</strong>
        <span>{{ data.unit }}</span>
      </div>
    </div>
    <p class="gauge__hint">
      较昨日
      <em :class="data.up ? 'gauge__hint--up' : 'gauge__hint--down'">{{ data.change }}</em>
    </p>
  </div>
</template>

<style scoped lang="scss">
.panel-card {
  padding: 18px 20px;
  background: $bg-container;
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

.chart-card {
  min-height: 320px;

  &--gauge {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;

  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }
}

.gauge {
  position: relative;
  width: 160px;
  height: 160px;
  margin-top: 4px;

  svg {
    width: 100%;
    height: 100%;
  }

  &__center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    strong {
      font-size: 30px;
      font-weight: 700;
      color: $text-primary;
    }

    span {
      font-size: 12px;
      color: $text-tertiary;
    }
  }

  &__hint {
    margin: 12px 0 0;
    font-size: 13px;
    color: $text-tertiary;

    em {
      font-style: normal;

      &--up {
        color: $color-success;
      }

      &--down {
        color: $color-danger;
      }
    }
  }
}
</style>
