import * as ReactGA from 'react-ga'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

window.THREE = THREE
import Effect from '../../Effect'

export default class Renderer {
  constructor() {
    this.renderer = null
    this.scene = null
    this.camera = null
    this.controls = null
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.INTERSECTED = null
    this.mouseWatchers = []
    this.mouseClick = false

    this.config = {
      planeData: {
        width: 400,
        height: 400,
        segmentsX: 50,
        segmentsY: 50,
        speed: 30,
        waveAmplitude: 64,
        colorSolid: 0x490c4f,
        color: 0x5ebcc6 // 0x31b3ff
      }
    }

    this._initRenderer()
    this.composer = new Effect(this)
  }


  _getRenderer() {
    return this.renderer
  }


  _getConfig() {
    return this.config
  }


  _getScene() {
    return this.scene
  }


  _getControls() {
    return this.controls
  }


  _getCamera() {
    return this.camera
  }

  _getMouseWatcher() {
    return this.mouseWatchers
  }

  _setMouseWatcher(item) {
    this.mouseWatchers.push(item)
  }

  _setCamera({
    x = this.camera.position.x,
    y = this.camera.position.y,
    z = this.camera.position.z
  } = {}) {

    this.camera.position.set(x, y, z)

    if (this.controls) {
      this.controls.target.set(
        this.camera.position.x,
        this.camera.position.y,
        0
      )
      this.controls.update()
    }
  }


  _initListeners() {
    window.addEventListener('resize', this._handleResize.bind(this), false)
    window.addEventListener('mousemove', this._handleMouseMove.bind(this), false)
    window.addEventListener('mousedown', this._handleMouseDown.bind(this), false)
    window.addEventListener('touchstart', this._handleMouseDown.bind(this), false)
  }


  _handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }


  _handleMouseMove(e) {
    e.preventDefault()
		this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
		this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
  }

  _handleMouseDown(e) {
    e.preventDefault()
    this.mouseClick = true
  }


  _calculateMouseHover() {
    this.camera.updateMatrixWorld()
    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.mouseWatchers, true)

    if (intersects.length > 0 /*&& this.INTERSECTED !== intersects[0].object.parent*/) {

      if (this.mouseClick) {
        if (this.INTERSECTED && this.INTERSECTED.mouse && this.INTERSECTED.mouse.href) {
          window.location = this.INTERSECTED.mouse.href
        }
        this.mouseClick = false
      }

      if (intersects[0].object.parent !== this.INTERSECTED) {
        // old intersect
        if (this.INTERSECTED) this.INTERSECTED.mouse.out(this.INTERSECTED)
        // take in new intersect
        this.INTERSECTED = intersects[ 0 ].object.parent
        this.INTERSECTED.mouse.in(this.INTERSECTED)

        if (this.INTERSECTED.showHover) {
          document.body.style.cursor = 'pointer'
        } else {
          document.body.style.cursor = 'auto'
        }
      }

		} else if (this.INTERSECTED) {
      document.body.style.cursor = 'auto'
			if ( this.INTERSECTED ) this.INTERSECTED.mouse.out(this.INTERSECTED)
			this.INTERSECTED = null
		}
  }


  _anim() {
    this._calculateMouseHover()
    // this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this._anim.bind(this))
  }


  _initRenderer() {
    let renderRoot = document.getElementsByClassName('gl')

    this.renderer = new THREE.WebGLRenderer({
      // alpha: true,
      antialias: true
    })

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x130b2e)
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // this.controls.minPolarAngle = THREE.Math.degToRad(70)
    // this.controls.maxPolarAngle = THREE.Math.degToRad(85)
    // this.controls.maxDistance = 200;
    // this.controls.minDistance = 20;
    // this.controls.enablePan = false;
    // this.controls.enableDamping = true
    // this.controls.dampingFactor = 0.25
    // this.controls.enableZoom = false

    // setInterval(() => {
    //   console.log(this.camera.position)
    // }, 5000)


    this.renderer.setSize(window.innerWidth, window.innerHeight)
    renderRoot[0].appendChild(this.renderer.domElement)


    this._initListeners()
    this._anim()
  }



}
