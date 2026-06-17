<script setup>
import {
  APPROVAL_STATUS_TYPES,
  getStatusLabel,
  getTypeLabel,
} from '@/constants/approval'

defineProps({
  item: {
    type: Object,
    default: null,
  },
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

function formatTime(value) {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleString('zh-CN')
}
</script>

<template>
  <el-drawer :model-value="open" title="审批详情" size="420px" @close="emit('close')">
    <template v-if="item">
      <div class="approval-detail">
        <h3>{{ item.title }}</h3>
        <el-tag size="small" :type="APPROVAL_STATUS_TYPES[item.status] ?? 'info'">
          {{ getStatusLabel(item.status) }}
        </el-tag>

        <dl>
          <div><dt>类型</dt><dd>{{ getTypeLabel(item.type) }}</dd></div>
          <div><dt>申请人</dt><dd>{{ item.applicant }}</dd></div>
          <div><dt>区域</dt><dd>{{ item.region }}</dd></div>
          <div v-if="item.amount"><dt>预算</dt><dd>¥ {{ item.amount.toLocaleString() }}</dd></div>
          <div><dt>提交时间</dt><dd>{{ formatTime(item.createdAt) }}</dd></div>
          <div v-if="item.approver"><dt>审批人</dt><dd>{{ item.approver }}</dd></div>
          <div v-if="item.rejectReason"><dt>驳回原因</dt><dd>{{ item.rejectReason }}</dd></div>
        </dl>

        <section>
          <p>摘要</p>
          <article>{{ item.summary }}</article>
        </section>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
.approval-detail {
  h3 {
    margin: 0 0 8px;
    font-size: 18px;
  }

  dl {
    display: grid;
    gap: 10px;
    margin: 16px 0;
  }

  dt {
    font-size: 11px;
    color: $text-tertiary;
  }

  dd {
    margin: 2px 0 0;
    font-size: 13px;
    color: $text-primary;
  }

  section {
    p {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 600;
    }

    article {
      padding: 12px;
      font-size: 13px;
      line-height: 1.7;
      color: $text-secondary;
      background: $bg-page;
      border-radius: $radius-base;
    }
  }
}
</style>
