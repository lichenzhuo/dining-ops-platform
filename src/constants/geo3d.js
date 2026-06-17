/** 省份中心点（用于 3D 柱状体） */
export const GEO_REGION_CENTERS = [
  { name: '上海市', lng: 121.47, lat: 31.23 },
  { name: '浙江省', lng: 120.15, lat: 29.28 },
  { name: '江苏省', lng: 118.76, lat: 32.06 },
  { name: '安徽省', lng: 117.28, lat: 31.86 },
]

export const CESIUM_DEFAULT_VIEW = {
  lng: 119.5,
  lat: 31.2,
  height: 1200000,
  pitch: -45,
}

export const THREE_KPI_CARDS = [
  { label: '营业额', value: '128.6万', color: 0x13c2c2 },
  { label: '订单量', value: '4.2万', color: 0x1677ff },
  { label: '复购率', value: '32.6%', color: 0x722ed1 },
]

/** 将数值映射为柱状体高度（米） */
export function regionBarHeight(value, max = 1000000) {
  const ratio = Math.min(value / max, 1)
  return 20000 + ratio * 180000
}

/** 生成 hub → store 弧线飞线采样点 */
export function buildArcPositions(from, to, peakHeight = 80000, segments = 24) {
  const positions = []
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments
    const lng = from.lng + (to.lng - from.lng) * t
    const lat = from.lat + (to.lat - from.lat) * t
    const height = peakHeight * Math.sin(Math.PI * t)
    positions.push(lng, lat, height)
  }
  return positions
}
