import * as THREE from 'three'
import { ARButton } from 'three/addons/webxr/ARButton.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let camera, scene, renderer
let controls

let dodecaMesh, ringMesh, tetraMesh

init()
animate()

function init() {
  const container = document.createElement('div')
  document.body.appendChild(container)

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    40
  )
  camera.position.z = 3

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.xr.enabled = true
  container.appendChild(renderer.domElement)

  // Light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 3.5)
  directionalLight.position.set(3, 3, 3)
  scene.add(directionalLight)

  const pointLight = new THREE.PointLight(0xffffff, 8, 20)
  pointLight.position.set(-2, 2, 2)
  scene.add(pointLight)

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.1)
  scene.add(ambientLight)

  // ===== 1) DodecahedronGeometry =====
  const dodecaGeo = new THREE.DodecahedronGeometry(0.55, 0)
  const dodecaMat = new THREE.MeshPhysicalMaterial({
    color: 0x4dd0e1,
    roughness: 0.35,
    metalness: 0.75,
    clearcoat: 0.7,
    clearcoatRoughness: 0.2,
  })
  dodecaMesh = new THREE.Mesh(dodecaGeo, dodecaMat)
  dodecaMesh.position.set(-1.2, 0, -1.4) // трохи “вперед” від камери
  scene.add(dodecaMesh)

  // ===== 2) RingGeometry =====
  const ringGeo = new THREE.RingGeometry(0.25, 0.55, 64)
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xff6f00,
    emissive: 0xff6f00,
    emissiveIntensity: 1.2,
    roughness: 0.25,
    metalness: 0.3,
    side: THREE.DoubleSide,
  })
  ringMesh = new THREE.Mesh(ringGeo, ringMat)
  ringMesh.position.set(0, 0.1, -1.2)
  ringMesh.rotation.x = Math.PI / 2 // щоб “стояло” як кільце у просторі
  scene.add(ringMesh)

  // ===== 3) TetrahedronGeometry =====
  const tetraGeo = new THREE.TetrahedronGeometry(0.55, 0)
  const tetraMat = new THREE.MeshStandardMaterial({
    color: 0x7c4dff,
    roughness: 0.7,
    metalness: 0.15,
  })
  tetraMesh = new THREE.Mesh(tetraGeo, tetraMat)
  tetraMesh.position.set(1.2, -0.05, -1.5)
  scene.add(tetraMesh)

  // Controls (для огляду на сторінці, до AR)
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // AR Button
  document.body.appendChild(
    ARButton.createButton(renderer, {
      requiredFeatures: [], // для task1 hit-test не треба
    })
  )

  window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  renderer.setAnimationLoop(render)
  controls.update()
}

function render() {
  rotateObjects()
  renderer.render(scene, camera)
}

function rotateObjects() {
  if (dodecaMesh) {
    dodecaMesh.rotation.y -= 0.01
    dodecaMesh.rotation.x += 0.006
  }
  if (ringMesh) {
    ringMesh.rotation.z += 0.012
  }
  if (tetraMesh) {
    tetraMesh.rotation.y += 0.015
    tetraMesh.rotation.x -= 0.007
  }
}