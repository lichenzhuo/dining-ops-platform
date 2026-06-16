<template>
  <div class="login-brand-panel">
    <div class="brand-bg" aria-hidden="true">
      <div class="brand-bg__mesh" />
      <div class="brand-bg__glow brand-bg__glow--1" />
      <div class="brand-bg__glow brand-bg__glow--2" />
    </div>

    <header class="brand-logo">
      <span class="brand-logo__mark">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="url(#brandGrad)" />
          <path
            d="M10 12c0 4 2.6 6.5 6 6.5S22 16 22 12M16 18.5V23"
            stroke="#fff"
            stroke-width="1.6"
            stroke-linecap="round"
          />
          <circle cx="16" cy="11" r="1.4" fill="#fff" />
          <defs>
            <linearGradient id="brandGrad" x1="3" y1="3" x2="29" y2="29">
              <stop stop-color="#36cfc9" />
              <stop offset="1" stop-color="#13a8a8" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <div class="brand-logo__text">
        <strong>味链云</strong>
        <span>连锁餐饮数字化运营管理平台</span>
      </div>
    </header>

    <div class="brand-copy">
      <h1 class="brand-headline">连锁餐饮经营与<br />营销管理系统</h1>
      <p class="brand-summary">经营数据、营销协同、门店执行与 AI 智能一体化</p>
    </div>

    <div class="brand-scene" aria-hidden="true">
      <div class="scene-card scene-card--dashboard">
        <div class="scene-card__head">
          <span class="scene-card__title">Smart Marketing</span>
          <em>+12.6%</em>
        </div>
        <div class="scene-chart">
          <span
            v-for="n in 8"
            :key="n"
            class="scene-chart__bar"
            :style="{ height: `${30 + ((n * 37) % 60)}%` }"
          />
        </div>
        <div class="scene-metrics">
          <div><strong>8,656</strong><span>本月营业额</span></div>
          <div><strong>2,384</strong><span>新增会员</span></div>
        </div>
      </div>

      <div class="scene-card scene-card--ring">
        <div class="scene-ring">
          <svg viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" stroke="#e8f5f4" stroke-width="8" fill="none" />
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="#13c2c2"
              stroke-width="8"
              fill="none"
              stroke-linecap="round"
              stroke-dasharray="163"
              stroke-dashoffset="44"
              transform="rotate(-90 32 32)"
            />
          </svg>
          <strong>73%</strong>
        </div>
        <span>活动达成率</span>
      </div>

      <div class="scene-card scene-card--ai">
        <span class="scene-ai-avatar">AI</span>
        <div>
          <p>智能营销助手</p>
          <strong>推送午市套餐方案</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-brand-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 56px 56px 40px;
  overflow: hidden;
}

.brand-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(150deg, #e9fbf8 0%, #f3fbfd 45%, #eef4ff 100%);
}

.brand-bg__mesh {
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-image:
    linear-gradient(rgba(19, 194, 194, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(19, 194, 194, 0.05) 1px, transparent 1px);
  background-size: 36px 36px;
}

.brand-bg__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
}

.brand-bg__glow--1 {
  top: -8%;
  right: -6%;
  width: 340px;
  height: 340px;
  background: rgba(54, 207, 201, 0.4);
}

.brand-bg__glow--2 {
  bottom: 4%;
  left: -10%;
  width: 300px;
  height: 300px;
  background: rgba(22, 119, 255, 0.16);
}

.brand-logo {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 12px;
  align-items: center;
}

.brand-logo__mark {
  display: flex;
  width: 40px;
  height: 40px;

  svg {
    width: 100%;
    height: 100%;
  }
}

.brand-logo__text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;

  strong {
    font-size: 20px;
    font-weight: 700;
    color: $color-brand-dark;
  }

  span {
    font-size: 12px;
    color: $text-tertiary;
  }
}

.brand-copy {
  position: relative;
  z-index: 1;
  margin-top: 56px;
}

.brand-headline {
  margin: 0 0 16px;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.4;
  color: $text-primary;
}

.brand-summary {
  margin: 0;
  font-size: 15px;
  color: $text-secondary;
}

.brand-scene {
  position: relative;
  z-index: 1;
  flex: 1;
  margin-top: 24px;
}

.scene-card {
  position: absolute;
  background: #fff;
  border: 1px solid rgba(19, 194, 194, 0.12);
  border-radius: $radius-lg;
  box-shadow: 0 18px 48px rgba(11, 61, 92, 0.12);
  color: $text-primary;
}

.scene-card--dashboard {
  top: 8%;
  left: 0;
  width: 268px;
  padding: 16px 18px;
}

.scene-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.scene-card__title {
  font-size: 13px;
  font-weight: 600;
  color: $text-secondary;
}

.scene-card__head em {
  font-style: normal;
  font-size: 12px;
  font-weight: 600;
  color: $color-success;
}

.scene-chart {
  display: flex;
  gap: 7px;
  align-items: flex-end;
  height: 76px;
  margin-bottom: 14px;
}

.scene-chart__bar {
  flex: 1;
  background: linear-gradient(180deg, #36cfc9 0%, rgba(54, 207, 201, 0.25) 100%);
  border-radius: 4px 4px 0 0;
}

.scene-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  strong {
    display: block;
    font-size: 18px;
    color: $color-brand-dark;
  }

  span {
    font-size: 11px;
    color: $text-tertiary;
  }
}

.scene-card--ring {
  right: 6%;
  bottom: 28%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 132px;
  padding: 16px;

  span {
    margin-top: 8px;
    font-size: 12px;
    color: $text-tertiary;
  }
}

.scene-ring {
  position: relative;
  width: 72px;
  height: 72px;

  svg {
    width: 100%;
    height: 100%;
  }

  strong {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: $color-brand-dark;
  }
}

.scene-card--ai {
  bottom: 6%;
  left: 10%;
  display: flex;
  gap: 12px;
  align-items: center;
  width: 232px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f4f0ff 0%, #fff 60%);

  p {
    margin: 0 0 4px;
    font-size: 11px;
    color: $text-tertiary;
  }

  strong {
    font-size: 13px;
    color: $color-brand-dark;
  }
}

.scene-ai-avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #722ed1 0%, #13c2c2 100%);
  border-radius: 10px;
}

@media (max-width: 1180px) {
  .login-brand-panel {
    padding: 40px;
  }

  .brand-headline {
    font-size: 28px;
  }
}
</style>
