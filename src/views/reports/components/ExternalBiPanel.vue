<template>
  <div class="external-bi">
    <el-alert
      title="外部 BI 兼容入口"
      type="info"
      :closable="false"
      show-icon
      description="历史 BI 或第三方报表系统可通过 iframe 接入。核心经营报表仍采用原生 Vue 实现，以保证权限、筛选、下钻和导出体验一致。"
    />
    <div class="external-bi__frame">
      <div class="external-bi__placeholder">
        <el-icon :size="36"><Link /></el-icon>
        <p>外部 BI 报表占位区</p>
        <span>生产环境可配置 iframe src 指向 FineBI / 帆软 / 自研 BI</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.external-bi {
  display: grid;
  gap: 16px;
}

.external-bi__frame {
  min-height: 420px;
  background: $bg-container;
  border: 1px dashed $border-color;
  border-radius: $radius-lg;
}

.external-bi__placeholder {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 420px;
  color: $text-tertiary;

  p {
    margin: 8px 0 0;
    font-size: 16px;
    font-weight: 600;
    color: $text-secondary;
  }

  span {
    font-size: 13px;
  }
}
</style>
