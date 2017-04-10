import * as ReactGA from 'react-ga'
import * as THREE from 'three'

window.THREE = THREE

export default class Renderer {
  constructor() {
    this.renderer = null
    this.scene = null
    this.camera = null

    this._initRenderer()
  }


  _getRenderer() {
    return this.renderer
  }


  _getScene() {
    return this.scene
  }


  _getCamera() {
    return this.camera
  }


  _initListeners() {
    window.addEventListener('resize', this._handleResize.bind(this), false)
  }


  _handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }


  _anim() {
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this._anim.bind(this))
  }


  _initRenderer() {
    let renderRoot = document.getElementsByClassName('gl')

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x273e45)
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.z = 20

    this.renderer.setSize(window.innerWidth, window.innerHeight)
    renderRoot[0].appendChild(this.renderer.domElement)

    this._initListeners()
    this._anim()
  }
}
