import { GEO_MAP_PRESETS } from '@/constants/geo'

function buildLines(stores, hub) {
  if (!hub || !stores?.length) {
    return []
  }

  return stores.map((store) => ({
    coords: [
      [hub.lng, hub.lat],
      [store.lng, store.lat],
    ],
  }))
}

export function buildGeoMapOption({
  mapKey,
  theme = 'dark',
  center,
  zoom = 3.2,
  roam = false,
  regions = [],
  stores = [],
  hub = null,
  showVisualMap = true,
}) {
  const palette = GEO_MAP_PRESETS[theme] ?? GEO_MAP_PRESETS.dark
  const values = regions.map((item) => item.value).filter((value) => typeof value === 'number')
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 100

  const storePoints = stores.map((store) => ({
    name: store.name,
    value: [store.lng, store.lat, store.value ?? 0],
    province: store.province,
  }))

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: theme === 'dark' ? 'rgba(7, 20, 38, 0.92)' : '#fff',
      borderColor: theme === 'dark' ? 'rgba(19, 194, 194, 0.35)' : '#13c2c2',
      textStyle: { color: theme === 'dark' ? '#e6f4ff' : '#1d2129', fontSize: 12 },
      formatter: (params) => {
        if (params.seriesType === 'map') {
          const value = params.value ?? params.data?.value
          return `${params.name}<br/>营业额指数 ${value ?? '-'}`
        }
        if (params.seriesType === 'effectScatter') {
          return `${params.name}<br/>订单指数 ${params.value?.[2] ?? '-'}`
        }
        if (params.seriesType === 'lines') {
          return '订单流向'
        }
        return params.name
      },
    },
    visualMap: showVisualMap
      ? {
          show: regions.length > 0,
          min,
          max,
          left: 12,
          bottom: 12,
          calculable: true,
          text: ['高', '低'],
          textStyle: { color: palette.labelColor, fontSize: 11 },
          inRange: { color: palette.visualColors },
        }
      : undefined,
    geo: {
      map: mapKey,
      roam,
      zoom,
      center,
      label: {
        show: true,
        color: palette.labelColor,
        fontSize: 10,
      },
      itemStyle: {
        areaColor: palette.areaColor,
        borderColor: palette.borderColor,
        borderWidth: 1,
      },
      emphasis: {
        label: { show: true, color: theme === 'dark' ? '#fff' : '#1d2129' },
        itemStyle: { areaColor: palette.emphasisAreaColor },
      },
    },
    series: [
      {
        name: '区域热力',
        type: 'map',
        map: mapKey,
        geoIndex: 0,
        data: regions,
      },
      {
        name: '门店点位',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: { scale: 3.5, brushType: 'stroke' },
        symbolSize: (val) => Math.max(8, Math.sqrt(val[2] ?? 100) / 5),
        itemStyle: { color: '#13c2c2', shadowBlur: 8, shadowColor: 'rgba(19,194,194,0.45)' },
        data: storePoints,
      },
      {
        name: '订单飞线',
        type: 'lines',
        coordinateSystem: 'geo',
        zlevel: 1,
        effect: {
          show: true,
          period: 4,
          trailLength: 0.35,
          symbol: 'arrow',
          symbolSize: 6,
          color: '#1677ff',
        },
        lineStyle: {
          color: theme === 'dark' ? 'rgba(22, 119, 255, 0.65)' : '#1677ff',
          width: 1,
          curveness: 0.22,
          opacity: 0.75,
        },
        data: buildLines(stores, hub),
      },
    ],
  }
}
