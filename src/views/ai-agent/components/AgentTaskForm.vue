<script setup>
import {
  COPY_STYLE_OPTIONS,
  GOAL_OPTIONS,
  PLATFORM_OPTIONS,
  STORE_SCOPE_OPTIONS,
} from '@/constants/aiAgent'
import { PERMISSIONS } from '@/constants/permissions'

const taskForm = defineModel({ type: Object, required: true })

const emit = defineEmits(['generate'])

const platformOptions = PLATFORM_OPTIONS
</script>

<template>
  <section class="panel-card agent-form">
    <div class="agent-form__head">
      <h3>任务配置</h3>
      <el-tag size="small" effect="dark" type="success">Prompt 参数化</el-tag>
    </div>

    <el-form label-position="top" class="agent-form__body">
      <el-form-item label="推广目标">
        <el-select v-model="taskForm.goal" placeholder="选择推广目标">
          <el-option v-for="item in GOAL_OPTIONS" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="投放平台">
        <el-checkbox-group v-model="taskForm.platforms">
          <el-checkbox v-for="item in platformOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="关键词">
        <el-select
          v-model="taskForm.keywords"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="输入关键词后回车"
        />
      </el-form-item>

      <el-form-item label="门店范围">
        <el-select v-model="taskForm.storeScope">
          <el-option v-for="item in STORE_SCOPE_OPTIONS" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="活动预算（元）">
        <el-input-number v-model="taskForm.budget" :min="500" :max="50000" :step="500" />
      </el-form-item>

      <el-form-item label="文案风格">
        <el-radio-group v-model="taskForm.copyStyle">
          <el-radio v-for="item in COPY_STYLE_OPTIONS" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="补充说明">
        <el-input
          v-model="taskForm.prompt"
          type="textarea"
          :rows="3"
          placeholder="例如：强调双人套餐性价比，适合白领午市"
        />
      </el-form-item>

      <el-form-item label="提交审批">
        <el-switch v-model="taskForm.approvalRequired" active-text="需要审批" inactive-text="直接下发" />
      </el-form-item>

      <el-button type="primary" class="agent-form__submit" v-permission="PERMISSIONS.AI_GENERATE" @click="emit('generate')">
        <el-icon><MagicStick /></el-icon>
        生成营销方案
      </el-button>
    </el-form>
  </section>
</template>

<style scoped lang="scss">
.agent-form {
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    h3 {
      margin: 0;
      font-size: 15px;
    }
  }

  &__body {
    :deep(.el-form-item) {
      margin-bottom: 14px;
    }

    :deep(.el-select),
    :deep(.el-input-number) {
      width: 100%;
    }
  }

  &__submit {
    width: 100%;
    margin-top: 4px;
  }
}
</style>
