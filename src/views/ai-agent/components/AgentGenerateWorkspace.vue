<script setup>
import { useRouter } from 'vue-router'
import { CONTENT_SECTIONS } from '@/constants/aiAgent'

defineProps({
  content: {
    type: Object,
    default: null,
  },
  generating: {
    type: Boolean,
    default: false,
  },
  estimatedEffect: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update-field'])
</script>

<template>
  <section class="panel-card agent-workspace">
    <div class="agent-workspace__head">
      <div>
        <h3>AI 生成工作区</h3>
        <p>结构化输出 · 可编辑 · 可保存 · 进入审批与下发流程</p>
      </div>
      <el-tag v-if="content" size="small" type="success">已生成</el-tag>
    </div>

    <div v-if="generating" class="agent-workspace__loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>AI 正在结合经营数据生成营销内容…</span>
    </div>

    <el-empty v-else-if="!content" description="配置左侧任务参数后点击「生成营销方案」" />

    <template v-else>
      <div v-if="estimatedEffect" class="agent-workspace__effect">
        <article>
          <span>预估曝光</span>
          <strong>{{ estimatedEffect.exposure }}</strong>
        </article>
        <article>
          <span>预估转化</span>
          <strong>{{ estimatedEffect.conversion }}</strong>
        </article>
        <article>
          <span>预估增收</span>
          <strong>{{ estimatedEffect.revenue }}</strong>
        </article>
      </div>

      <div class="agent-workspace__sections">
        <div v-for="section in CONTENT_SECTIONS" :key="section.key" class="content-block">
          <label>{{ section.label }}</label>
          <el-input
            v-if="section.multiline"
            :model-value="content[section.key]"
            type="textarea"
            :rows="section.key === 'xiaohongshuContent' ? 5 : 3"
            @input="(val) => emit('update-field', section.key, val)"
          />
          <el-input
            v-else
            :model-value="content[section.key]"
            @input="(val) => emit('update-field', section.key, val)"
          />
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.agent-workspace {
  display: flex;
  flex-direction: column;
  min-height: 640px;

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: 15px;
    }

    p {
      margin: 4px 0 0;
      font-size: 12px;
      color: $text-tertiary;
    }
  }

  &__loading {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    justify-content: center;
    min-height: 320px;
    font-size: 13px;
    color: $text-secondary;

    .el-icon {
      font-size: 28px;
      color: #722ed1;
    }
  }

  &__effect {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 16px;

    article {
      padding: 12px;
      background: linear-gradient(135deg, #f7f4ff, #fff);
      border: 1px solid rgba(114, 46, 209, 0.12);
      border-radius: $radius-base;

      span {
        display: block;
        font-size: 11px;
        color: $text-tertiary;
      }

      strong {
        font-size: 14px;
        color: #722ed1;
      }
    }
  }

  &__sections {
    display: grid;
    gap: 14px;
  }
}

.content-block {
  label {
    display: block;
    margin-bottom: 6px;
    font-size: 12px;
    font-weight: 600;
    color: $text-primary;
  }
}
</style>
