import './style.css'
import * as THREE from 'three'
import { ARButton } from 'three/addons/webxr/ARButton.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let camera, scene, renderer
let controls
let model

init()
animate()

function init() {
  const container = document.createElement('div')
  document.body.appendChild(container)

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    40
  )
  camera.position.z = 3

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.xr.enabled = true
  container.appendChild(renderer.domElement)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  const modelUrl = `${import.meta.env.BASE_URL}task2model/scene.gltf`

  const loader = new GLTFLoader()
  loader.load(
    modelUrl,
    (gltf) => {
      model = gltf.scene

      model.position.set(0, -0.2, -1.5)
      model.scale.setScalar(0.6)

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false
          child.receiveShadow = false

          const mat = child.material
          if (mat) {
            mat.metalness = Math.min(0.6, mat.metalness ?? 0.0)
            mat.roughness = Math.max(0.25, mat.roughness ?? 0.7)
            mat.needsUpdate = true
          }
        }
      })

      scene.add(model)
      console.log('GLTF model loaded:', modelUrl)
    },
    undefined,
    (err) => {
      console.error('GLTF load error:', err)
    }
  )

  document.body.appendChild(ARButton.createButton(renderer))

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

let degrees = 0

function render() {

  if (model) {
    degrees = (degrees + 0.2) % 360
    model.rotation.y = THREE.MathUtils.degToRad(degrees)
  }

  renderer.render(scene, camera)
}