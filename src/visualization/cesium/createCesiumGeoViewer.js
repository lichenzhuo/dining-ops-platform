import {
  BoundingSphere,
  Cartesian2,
  Cartesian3,
  Color,
  CustomDataSource,
  Ion,
  Math as CesiumMath,
  OpenStreetMapImageryProvider,
  PolylineGlowMaterialProperty,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
} from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { buildArcPositions, regionBarHeight } from '@/constants/geo3d'

/** 开发演示用 Ion Token（生产环境请替换为项目自有 Token） */
Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxMy1hYWMyLTQ3NzYtYTg5My1hYjQ2YjQ0Y2Q3ZjQiLCJpZCI6NTc3MzMsImlhdCI6MTYyNDY0NjQ5OH0.XcKpgNS1SUdwFNVDPY3YBzRnKf8l3f0FMeHaFy8P6k0'

export async function createCesiumGeoViewer(container, geoData, handlers = {}) {
  const viewer = new Viewer(container, {
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: true,
    sceneModePicker: true,
    navigationHelpButton: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: true,
    imageryProvider: new OpenStreetMapImageryProvider({
      url: 'https://tile.openstreetmap.org/',
    }),
  })

  viewer.scene.globe.depthTestAgainstTerrain = false
  viewer.cesiumWidget.creditContainer.style.display = 'none'

  const dataSource = await viewer.dataSources.add(new CustomDataSource('dop-geo-3d'))

  dataSource.clustering.enabled = true
  dataSource.clustering.pixelRange = 36
  dataSource.clustering.minimumClusterSize = 2
  dataSource.clustering.clusterEvent.addEventListener((entities, cluster) => {
    cluster.label.show = true
    cluster.label.text = `${entities.length} 店`
    cluster.label.font = '12px sans-serif'
    cluster.label.fillColor = Color.fromCssColorString('#13c2c2')
    cluster.point.color = Color.fromCssColorString('#13c2c2').withAlpha(0.85)
    cluster.point.pixelSize = 18
  })

  geoData.regions?.forEach((region) => {
    const center = geoData.regionCenters?.find((item) => item.name === region.name)
    if (!center) {
      return
    }
    const barHeight = regionBarHeight(region.value)
    dataSource.entities.add({
      name: region.name,
      position: Cartesian3.fromDegrees(center.lng, center.lat, barHeight / 2),
      box: {
        dimensions: new Cartesian3(60000, 60000, barHeight),
        material: Color.fromCssColorString('#13c2c2').withAlpha(0.72),
        outline: true,
        outlineColor: Color.WHITE.withAlpha(0.35),
      },
      label: {
        text: `${region.name}\n${region.value.toLocaleString('zh-CN')}`,
        font: '12px sans-serif',
        fillColor: Color.WHITE,
        verticalOrigin: 1,
        pixelOffset: new Cartesian2(0, -12),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      properties: {
        entityType: 'region',
        payload: region,
      },
    })
  })

  geoData.stores?.forEach((store) => {
    dataSource.entities.add({
      id: `store-${store.name}`,
      name: store.name,
      position: Cartesian3.fromDegrees(store.lng, store.lat, 1200),
      point: {
        pixelSize: 12,
        color: Color.fromCssColorString('#1677ff'),
        outlineColor: Color.WHITE,
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: store.name,
        font: '11px sans-serif',
        fillColor: Color.fromCssColorString('#e6f4ff'),
        pixelOffset: new Cartesian2(0, -18),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        show: false,
      },
      properties: {
        entityType: 'store',
        payload: store,
      },
    })

    if (geoData.hub) {
      const arc = buildArcPositions(geoData.hub, store)
      dataSource.entities.add({
        polyline: {
          positions: Cartesian3.fromDegreesArrayHeights(arc),
          width: 2,
          material: new PolylineGlowMaterialProperty({
            glowPower: 0.25,
            color: Color.fromCssColorString('#36cfc9').withAlpha(0.85),
          }),
        },
      })
    }
  })

  if (geoData.hub) {
    dataSource.entities.add({
      name: geoData.hub.name,
      position: Cartesian3.fromDegrees(geoData.hub.lng, geoData.hub.lat, 8000),
      point: {
        pixelSize: 16,
        color: Color.fromCssColorString('#faad14'),
        outlineColor: Color.WHITE,
        outlineWidth: 2,
      },
      label: {
        text: `${geoData.hub.name} Hub`,
        font: '12px sans-serif',
        fillColor: Color.fromCssColorString('#ffd666'),
        pixelOffset: new Cartesian2(0, -20),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    })
  }

  const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((movement) => {
    const picked = viewer.scene.pick(movement.position)
    if (!picked?.id?.properties) {
      handlers.onClear?.()
      return
    }
    const entityType = picked.id.properties.entityType?.getValue()
    const payload = picked.id.properties.payload?.getValue()
    if (entityType === 'store') {
      picked.id.label.show = true
      handlers.onStoreClick?.(payload)
    } else if (entityType === 'region') {
      handlers.onRegionClick?.(payload)
    }
  }, ScreenSpaceEventType.LEFT_CLICK)

  function flyToData() {
    const positions = geoData.stores?.map((store) => Cartesian3.fromDegrees(store.lng, store.lat)) ?? []
    if (!positions.length) {
      return
    }
    const sphere = BoundingSphere.fromPoints(positions)
    viewer.camera.flyToBoundingSphere(sphere, {
      duration: 1.2,
      offset: {
        heading: CesiumMath.toRadians(0),
        pitch: CesiumMath.toRadians(-45),
        range: sphere.radius * 4.5,
      },
    })
  }

  flyToData()

  function dispose() {
    handler.destroy()
    viewer.destroy()
  }

  return { viewer, dataSource, dispose, flyToData }
}
