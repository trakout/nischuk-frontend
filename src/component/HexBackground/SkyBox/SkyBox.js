import videoSrc from '..//../../asset/stream/skybox.mp4'

export default class SkyBox {
  constructor(renderer) {
    this.renderer = renderer
    this.scene = renderer._getScene()
    this.camera = renderer._getCamera()
    this.controls = renderer._getControls()
    
    this._initSkybox()
  }

  _initSkybox() {
    let videoFrag = document.createElement('video')
    videoFrag.muted = true
    // videoFrag.width = 640
    // videoFrag.height = 360
    videoFrag.autoplay = true
    videoFrag.loop = true
    videoFrag.setAttribute('src', videoSrc)
    videoFrag.play()

    let texture = new THREE.VideoTexture(videoFrag)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.format = THREE.RGBFormat

    let geometry = new THREE.SphereGeometry( 100, 100, 100 );
    let material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.BackSide, fog: false} )
    let mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.set(0, 0, -Math.PI / 2)
    
    let {x, y, z} = this.camera.position
    mesh.position.set(x, y, z)

    this.scene.add(mesh)

  }

  // https://videohive.net/item/vr-360-panoramic-animations-cloud-chamber/14470915
  // https://videohive.net/item/vr-360-panoramic-animations-grid-universe/14472271?s_rank=8

}
