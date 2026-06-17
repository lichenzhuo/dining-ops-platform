<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="panel-card rank-card">
    <div class="card-head">
      <h3>门店达成率排行</h3>
    </div>
    <ul class="rank-list">
      <li v-for="(store, index) in items" :key="store.name">
        <span class="rank-no" :class="{ 'rank-no--top': index < 3 }">{{ index + 1 }}</span>
        <span class="rank-name">{{ store.name }}</span>
        <div class="rank-bar">
          <span :style="{ width: `${store.rate}%` }" />
        </div>
        <span class="rank-value">¥{{ (store.value / 10000).toFixed(1) }}万</span>
      </li>
    </ul>
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

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    gap: 12px;
    align-items: center;
  }
}

.rank-no {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  font-size: 12px;
  font-weight: 600;
  color: $text-tertiary;
  background: $bg-page;
  border-radius: 6px;

  &--top {
    color: #fff;
    background: $color-brand;
  }
}

.rank-name {
  flex-shrink: 0;
  width: 140px;
  overflow: hidden;
  font-size: 13px;
  color: $text-secondary;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-bar {
  flex: 1;
  height: 8px;
  background: $bg-page;
  border-radius: 999px;

  span {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #36cfc9, #13c2c2);
    border-radius: 999px;
  }
}

.rank-value {
  flex-shrink: 0;
  width: 64px;
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
  text-align: right;
}
</style>
