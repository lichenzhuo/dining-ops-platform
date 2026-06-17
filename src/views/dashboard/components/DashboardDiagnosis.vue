<script setup>
defineProps({
  diagnosis: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="diagnosis-banner">
    <div class="diagnosis-banner__icon">
      <el-icon :size="22"><DataLine /></el-icon>
    </div>
    <div class="diagnosis-banner__text">
      <strong>{{ diagnosis.title }}</strong>
      <p>{{ diagnosis.summary }}</p>
    </div>
    <div class="diagnosis-banner__tags">
      <span
        v-for="tag in diagnosis.tags"
        :key="tag.label"
        class="diag-tag"
        :class="`diag-tag--${tag.tone}`"
      >
        {{ tag.label }}
      </span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.diagnosis-banner {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 18px 24px;
  color: #fff;
  background: linear-gradient(120deg, #0e6b73 0%, #13a8a8 60%, #36cfc9 100%);
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

.diagnosis-banner__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 12px;
}

.diagnosis-banner__text {
  flex: 1;
  min-width: 0;

  strong {
    font-size: 16px;
    font-weight: 600;
  }

  p {
    margin: 4px 0 0;
    font-size: 13px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.86);
  }
}

.diagnosis-banner__tags {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}

.diag-tag {
  padding: 5px 12px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 999px;
}

@media (max-width: 768px) {
  .diagnosis-banner__tags {
    display: none;
  }
}
</style>
