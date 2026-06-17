<script setup>
import ScreenPanel from './ScreenPanel.vue'

defineProps({
  rightPanel: { type: Object, default: null },
})

const emit = defineEmits(['open-report'])

const alertTypeMap = {
  danger: 'danger',
  warning: 'warning',
  info: 'info',
}
</script>

<template>
  <div class="screen-right">
    <ScreenPanel title="今日运营动作" compact>
      <ul class="screen-right__list">
        <li v-for="item in rightPanel?.actions ?? []" :key="item">{{ item }}</li>
      </ul>
    </ScreenPanel>

    <ScreenPanel title="异常待处理" compact>
      <ul class="screen-right__alerts">
        <li v-for="(item, index) in rightPanel?.alerts ?? []" :key="index">
          <el-tag :type="alertTypeMap[item.level] ?? 'info'" size="small" effect="dark">
            {{ item.level === 'danger' ? '高' : item.level === 'warning' ? '中' : '低' }}
          </el-tag>
          <button type="button" class="screen-right__link" @click="emit('open-report', { report: 'store' })">
            {{ item.text }}
          </button>
        </li>
      </ul>
    </ScreenPanel>

    <ScreenPanel title="门店任务进度" compact>
      <div v-for="task in rightPanel?.tasks ?? []" :key="task.name" class="screen-right__task">
        <div class="screen-right__task-head">
          <span>{{ task.name }}</span>
          <em>{{ task.progress }}%</em>
        </div>
        <el-progress :percentage="task.progress" :stroke-width="6" :show-text="false" />
      </div>
    </ScreenPanel>

    <ScreenPanel title="员工推广 / AI 推荐" compact>
      <div class="screen-right__rank">
        <p>推广排名</p>
        <ul>
          <li v-for="(item, index) in rightPanel?.staffRank ?? []" :key="item.name">
            <span>{{ index + 1 }}. {{ item.name }}</span>
            <em>{{ item.conversion }} 单</em>
          </li>
        </ul>
      </div>
      <div class="screen-right__ai">
        <p>AI 推荐动作</p>
        <ul>
          <li v-for="item in rightPanel?.aiActions ?? []" :key="item">{{ item }}</li>
        </ul>
      </div>
    </ScreenPanel>
  </div>
</template>

<style scoped lang="scss">
.screen-right {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  min-height: 0;

  &__list,
  &__alerts,
  &__rank ul,
  &__ai ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__list li,
  &__ai li {
    padding: 4px 0;
    font-size: 12px;
    line-height: 1.6;
    color: $screen-text-secondary;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
  }

  &__alerts li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px;
    align-items: start;
    padding: 6px 0;
    font-size: 12px;
  }

  &__link {
    padding: 0;
    font: inherit;
    color: $screen-text-primary;
    text-align: left;
    cursor: pointer;
    background: none;
    border: none;
  }

  &__task {
    & + & {
      margin-top: 10px;
    }
  }

  &__task-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    font-size: 12px;
    color: $screen-text-secondary;

    em {
      font-style: normal;
      color: $screen-accent;
    }
  }

  &__rank,
  &__ai {
    p {
      margin: 0 0 6px;
      font-size: 12px;
      color: $screen-text-primary;
    }

    ul {
      font-size: 12px;
      line-height: 1.7;
      color: $screen-text-secondary;
    }

    li {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }

    em {
      font-style: normal;
      color: $screen-accent;
    }
  }

  &__ai {
    margin-top: 10px;
  }
}
</style>
