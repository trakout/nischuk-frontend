import * as ReactGA from 'react-ga'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

window.THREE = THREE

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

    this._initRenderer()
  }


  _getRenderer() {
    return this.renderer
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


  _initListeners() {
    window.addEventListener('resize', this._handleResize.bind(this), false)
    window.addEventListener('mousemove', this._handleMouseMove.bind(this), false)
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


  _calculateMouseHover() {
    this.camera.updateMatrixWorld()
    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.mouseWatchers, true)

    if (intersects.length > 0 /*&& this.INTERSECTED !== intersects[0].object.parent*/) {

    //   if (this.mouseClick && this.intersected) {
    //     this.mouseClick = false
    //     this.intersected.click(this.intersected)
    //   }

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

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // this.controls.enableDamping = true
    // this.controls.dampingFactor = 0.25
    // this.controls.enableZoom = false


    this.renderer.setSize(window.innerWidth, window.innerHeight)
    renderRoot[0].appendChild(this.renderer.domElement)


    this._initListeners()
    this._anim()
  }
}
