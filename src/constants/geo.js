/** 华东区经营态势：省份热力、门店经纬度、订单飞线 hub */
export const GEO_HUB = {
  name: '华东区',
  lng: 119.5,
  lat: 31.2,
}

export const GEO_STORES = [
  { name: '上海南京路店', lng: 121.4737, lat: 31.2304, province: '上海市' },
  { name: '杭州西湖店', lng: 120.1551, lat: 30.2741, province: '浙江省' },
  { name: '南京新街口店', lng: 118.7969, lat: 32.0603, province: '江苏省' },
  { name: '苏州观前街店', lng: 120.6197, lat: 31.299, province: '江苏省' },
  { name: '宁波天一店', lng: 121.5504, lat: 29.8746, province: '浙江省' },
  { name: '合肥淮河路店', lng: 117.283, lat: 31.8612, province: '安徽省' },
  { name: '无锡崇安寺店', lng: 120.3119, lat: 31.4912, province: '江苏省' },
  { name: '上海陆家嘴店', lng: 121.4998, lat: 31.2397, province: '上海市' },
]

export const GEO_PROVINCES = ['上海市', '江苏省', '浙江省', '安徽省']

export const CHINA_MAP_KEY = 'china'
export const CHINA_GEO_URL = '/geo/china.json'

export const GEO_MAP_PRESETS = {
  dark: {
    areaColor: 'rgba(19, 194, 194, 0.08)',
    borderColor: 'rgba(19, 194, 194, 0.45)',
    emphasisAreaColor: 'rgba(19, 194, 194, 0.28)',
    labelColor: 'rgba(230, 244, 255, 0.75)',
    visualColors: ['#0b3d5c', '#13c2c2'],
  },
  light: {
    areaColor: '#e6fffb',
    borderColor: '#13c2c2',
    emphasisAreaColor: '#b5f5ec',
    labelColor: '#4e5969',
    visualColors: ['#e6fffb', '#08979c'],
  },
}
