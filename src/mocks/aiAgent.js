import { COPY_STYLE_OPTIONS, PLATFORM_OPTIONS } from '@/constants/aiAgent'

function delay(ms = 1200) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function pickPlatformLabels(values = []) {
  return values
    .map((value) => PLATFORM_OPTIONS.find((item) => item.value === value)?.label ?? value)
    .join('、')
}

function buildCopyByStyle(style, goal, keywords) {
  const keywordText = keywords.slice(0, 3).join('、') || '招牌套餐'
  const styleMap = {
    lively: {
      tone: '种草感',
      opener: '姐妹们冲！',
    },
    professional: {
      tone: '专业可信',
      opener: '推荐理由：',
    },
    promotion: {
      tone: '优惠驱动',
      opener: '限时福利：',
    },
  }
  const tone = styleMap[style] ?? styleMap.lively
  return { tone, opener, keywordText, goal }
}

export async function mockFetchStoreInsights(query) {
  await delay(500)
  const { brand, region, store } = query
  return {
    brand,
    region,
    store,
    revenue7d: store === '全部门店' ? 128.6 : 18.4,
    revenueUnit: store === '全部门店' ? '万' : '万',
    footfall7d: store === '全部门店' ? 4.2 : 0.58,
    footfallUnit: '万',
    repurchaseRate: 32.6,
    channelConversion: [
      { channel: '堂食', rate: 18.2 },
      { channel: '美团', rate: 12.4 },
      { channel: '抖音', rate: 9.8 },
    ],
    storeProfile: [
      `${region}客单价中等偏上，午市 11:30-13:30 为高峰`,
      '25-35 岁白领占比 42%，偏好套餐与轻食',
      '近 7 日差评集中在出餐速度与套餐分量',
    ],
  }
}

export async function mockGenerateMarketingContent(task, query) {
  await delay(1600)

  const { tone, opener, keywordText, goal } = buildCopyByStyle(
    task.copyStyle,
    task.goal,
    task.keywords,
  )
  const platformText = pickPlatformLabels(task.platforms)
  const storeText = task.storeScope

  const xiaohongshuTitle = `${opener}${keywordText}｜${goal}实测分享`
  const xiaohongshuContent = `${tone}风格笔记：\n\n今天在${storeText}体验了${keywordText}，${goal}真的有效！\n\n✅ 环境干净，出餐稳定\n✅ ${platformText}同步活动，到店核销方便\n✅ 适合同事聚餐 / 闺蜜打卡\n\n#餐饮种草 #${keywordText} #${query.brand}`

  const meituanReview = `「${keywordText}」性价比很高，${goal}期间服务态度好，套餐分量足，会推荐给附近同事。`

  const staffForward = `【${query.brand}·${storeText}】${goal}进行中！${keywordText}限时优惠，扫码领券到店核销，转发朋友圈集赞再减 5 元～`

  const imagePrompt = `美食摄影，${keywordText}特写，暖色调灯光，${query.brand}门店氛围，俯拍构图，高清细节，适合${platformText}投放`

  const promotionSuggestion = `建议配置「${keywordText}」${task.budget} 元预算，在${platformText}同步投放；${storeText}午市加推扫码领券，预计带动 8%-12% 转化提升。`

  const complianceIssues = []
  if (task.keywords.some((word) => ['最', '第一', '绝对'].includes(word))) {
    complianceIssues.push('文案含绝对化用语，建议改为「优选」「推荐」')
  }
  if (task.budget > 10000) {
    complianceIssues.push('预算超过单店常规活动上限，建议拆分批次审批')
  }

  return {
    id: `gen-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    xiaohongshuTitle,
    xiaohongshuContent,
    meituanReview,
    staffForward,
    imagePrompt,
    promotionSuggestion,
    estimatedEffect: {
      exposure: '1.2万 - 1.8万',
      conversion: '8% - 12%',
      revenue: '¥1.5万 - ¥2.2万',
    },
    compliance: {
      passed: complianceIssues.length === 0,
      issues: complianceIssues.length
        ? complianceIssues
        : ['未发现明显违规词', '价格表述符合平台规范', '未涉及医疗功效承诺'],
    },
    meta: {
      goal: task.goal,
      platforms: task.platforms,
      storeScope: task.storeScope,
      prompt: task.prompt,
    },
  }
}

export async function mockSubmitApproval(payload) {
  await delay(800)
  return {
    approvalId: `apv-${Date.now()}`,
    status: 'pending',
    title: payload.title,
    applicant: payload.applicant,
    submittedAt: new Date().toISOString(),
  }
}

export async function mockDispatchToStores(payload) {
  await delay(900)
  const storeCount = payload.storeScope === '全部门店' ? 128 : payload.storeScope.includes('区') ? 36 : 1
  return {
    dispatchId: `dsp-${Date.now()}`,
    storeCount,
    dispatchedAt: new Date().toISOString(),
    channels: payload.platforms,
  }
}

export async function mockFetchTrackingEffect(dispatchId) {
  await delay(600)
  return {
    dispatchId,
    impressions: 8640,
    clicks: 986,
    conversions: 112,
    revenue: 18640,
    roi: 2.4,
    updatedAt: new Date().toISOString(),
  }
}
