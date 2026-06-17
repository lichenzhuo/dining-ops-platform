<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    default: () => [],
  },
  rowHeight: {
    type: Number,
    default: 40,
  },
  height: {
    type: Number,
    default: 420,
  },
})

const scrollTop = ref(0)
const buffer = 4

const visibleRowCount = computed(() => Math.ceil(props.height / props.rowHeight) + buffer)
const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - Math.floor(buffer / 2)),
)
const endIndex = computed(() =>
  Math.min(props.rows.length, startIndex.value + visibleRowCount.value),
)
const visibleRows = computed(() => props.rows.slice(startIndex.value, endIndex.value))
const totalHeight = computed(() => props.rows.length * props.rowHeight)
const offsetY = computed(() => startIndex.value * props.rowHeight)

function handleScroll(event) {
  scrollTop.value = event.target.scrollTop
}

function formatCell(row, column) {
  const value = row[column.key]
  if (column.formatter) {
    return column.formatter(value, row)
  }
  return value
}
</script>

<template>
  <div class="virtual-scroll-table">
    <div class="virtual-scroll-table__head">
      <div
        v-for="col in columns"
        :key="col.key"
        class="virtual-scroll-table__cell virtual-scroll-table__cell--head"
        :style="{ width: col.width ? `${col.width}px` : undefined, flex: col.width ? 'none' : '1' }"
      >
        {{ col.label }}
      </div>
    </div>

    <div class="virtual-scroll-table__body" :style="{ height: `${height}px` }" @scroll="handleScroll">
      <div class="virtual-scroll-table__phantom" :style="{ height: `${totalHeight}px` }">
        <div
          class="virtual-scroll-table__window"
          :style="{ transform: `translateY(${offsetY}px)` }"
        >
          <div
            v-for="(row, index) in visibleRows"
            :key="row.id ?? startIndex + index"
            class="virtual-scroll-table__row"
            :style="{ height: `${rowHeight}px` }"
          >
            <div
              v-for="col in columns"
              :key="col.key"
              class="virtual-scroll-table__cell"
              :style="{ width: col.width ? `${col.width}px` : undefined, flex: col.width ? 'none' : '1' }"
            >
              {{ formatCell(row, col) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="virtual-scroll-table__meta">
      共 {{ rows.length.toLocaleString('zh-CN') }} 行 · 当前渲染
      {{ visibleRows.length.toLocaleString('zh-CN') }} 行（虚拟滚动）
    </p>
  </div>
</template>

<style scoped lang="scss">
.virtual-scroll-table {
  border: 1px solid $border-light;
  border-radius: $radius-lg;
  overflow: hidden;
  background: $bg-container;

  &__head,
  &__row {
    display: flex;
    align-items: center;
    min-width: 100%;
  }

  &__head {
    background: $bg-page;
    border-bottom: 1px solid $border-light;
  }

  &__cell {
    padding: 0 12px;
    font-size: 13px;
    color: $text-primary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &--head {
      height: 40px;
      line-height: 40px;
      font-weight: 600;
      color: $text-secondary;
    }
  }

  &__body {
    overflow: auto;
  }

  &__phantom {
    position: relative;
    width: 100%;
  }

  &__window {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  &__row {
    border-bottom: 1px solid $border-light;

    &:nth-child(even) {
      background: rgba(247, 249, 251, 0.8);
    }
  }

  &__meta {
    margin: 0;
    padding: 8px 12px;
    font-size: 12px;
    color: $text-tertiary;
    border-top: 1px solid $border-light;
  }
}
</style>
