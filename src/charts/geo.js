import echarts from './echarts'
import { CHINA_GEO_URL, CHINA_MAP_KEY } from '@/constants/geo'

const registeredMaps = new Set()
const pendingMaps = new Map()

export async function registerGeoMap(mapKey = CHINA_MAP_KEY, url = CHINA_GEO_URL) {
  if (registeredMaps.has(mapKey)) {
    return mapKey
  }

  if (pendingMaps.has(mapKey)) {
    return pendingMaps.get(mapKey)
  }

  const promise = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`GeoJSON 加载失败：${url}`)
      }
      return response.json()
    })
    .then((geoJson) => {
      echarts.registerMap(mapKey, geoJson)
      registeredMaps.add(mapKey)
      pendingMaps.delete(mapKey)
      return mapKey
    })
    .catch((error) => {
      pendingMaps.delete(mapKey)
      throw error
    })

  pendingMaps.set(mapKey, promise)
  return promise
}

export async function loadChinaMap() {
  return registerGeoMap(CHINA_MAP_KEY, CHINA_GEO_URL)
}
