import * as THREE from 'three'

export function createThreeStoreCardScene(container) {
  const width = container.clientWidth || 640
  const height = container.clientHeight || 360

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x071426)
  scene.fog = new THREE.Fog(0x071426, 8, 22)

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
  camera.position.set(0, 4.5, 9)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)

  const ambient = new THREE.AmbientLight(0xffffff, 0.55)
  const keyLight = new THREE.DirectionalLight(0x36cfc9, 1.1)
  keyLight.position.set(4, 8, 6)
  const fillLight = new THREE.DirectionalLight(0x1677ff, 0.45)
  fillLight.position.set(-6, 2, -4)
  scene.add(ambient, keyLight, fillLight)

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 10),
    new THREE.MeshStandardMaterial({ color: 0x0b3d5c, metalness: 0.2, roughness: 0.85 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1.2
  scene.add(floor)

  const cards = []
  const cardConfigs = [
    { x: -2.8, color: 0x13c2c2, emissive: 0x0a5c5c },
    { x: 0, color: 0x1677ff, emissive: 0x0b3d5c },
    { x: 2.8, color: 0x722ed1, emissive: 0x2a1261 },
  ]

  cardConfigs.forEach((config) => {
    const group = new THREE.Group()
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 1.4, 0.18),
      new THREE.MeshStandardMaterial({
        color: config.color,
        emissive: config.emissive,
        emissiveIntensity: 0.35,
        metalness: 0.35,
        roughness: 0.4,
      }),
    )
    body.position.y = 0.2
    group.add(body)

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.72, 0.35, 24),
      new THREE.MeshStandardMaterial({ color: 0x102a43, metalness: 0.5, roughness: 0.35 }),
    )
    pedestal.position.y = -0.55
    group.add(pedestal)

    group.position.x = config.x
    scene.add(group)
    cards.push(group)
  })

  let frameId = null
  const clock = new THREE.Clock()

  function animate() {
    const elapsed = clock.getElapsedTime()
    cards.forEach((card, index) => {
      card.rotation.y = Math.sin(elapsed * 0.6 + index) * 0.18
      card.position.y = Math.sin(elapsed * 1.2 + index * 0.8) * 0.08
    })
    renderer.render(scene, camera)
    frameId = window.requestAnimationFrame(animate)
  }

  animate()

  function handleResize() {
    const nextWidth = container.clientWidth || width
    const nextHeight = container.clientHeight || height
    camera.aspect = nextWidth / nextHeight
    camera.updateProjectionMatrix()
    renderer.setSize(nextWidth, nextHeight)
  }

  const resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(container)

  function dispose() {
    if (frameId) {
      window.cancelAnimationFrame(frameId)
    }
    resizeObserver.disconnect()
    renderer.dispose()
    scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose()
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement)
    }
  }

  return { dispose, renderer, scene, camera }
}
