

export default class SkyBox {
  constructor(renderer) {
    this.renderer = renderer
    this.scene = renderer._getScene()
    this.camera = renderer._getCamera()
    this.controls = renderer._getControls()
    
    this._initSkybox()
  }

  _initSkybox() {
    const DIR = '../../../../asset/img/skybox/'
    let src = [
      '1right.jpg',
      '2left.jpg',
      '3top.jpg',
      '4bottom.jpg',
      '5front.jpg',
      '6back.jpg'
    ]

    let cubeTexture = new THREE.CubeTextureLoader().setPath(DIR).load(src)
    console.log(cubeTexture)
    // cubeTexture.rotation = Math.PI / 2

    this.scene.background = cubeTexture
    this.scene.background.rotation = Math.PI / 2

    // const shaderCube = THREE.ShaderLib["cube"]
    // let uniforms = THREE.UniformsUtils.clone(shaderCube.uniforms)
    // uniforms['tCube'].texture= textureCube

    // let material = new THREE.ShaderMaterial({
    //     fragmentShader    : shaderCube.fragmentShader,
    //     vertexShader  : shaderCube.vertexShader,
    //     uniforms  : uniforms,
    //     // side: THREE.BackSide,
    //     // fog: false
    // })

    // console.log(material)

    // let skyboxMesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100, 1, 1, 1, null, true), material)
    // this.scene.add(skyboxMesh)
  }

  // TODO: animate skyboxes?
  // https://videohive.net/item/vr-360-panoramic-animations-cloud-chamber/14470915
  // https://videohive.net/item/vr-360-panoramic-animations-grid-universe/14472271?s_rank=8

}
