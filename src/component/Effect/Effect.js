import { BloomEffect, VignetteEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing'


export default class Effect {
  constructor(renderer) {
    this.renderer = renderer
    this.config = renderer._getConfig()
    this.scene = renderer._getScene()
    this.camera = renderer._getCamera()
    this.controls = renderer._getControls()

    this._initEffectComposer()
    this._anim.bind(this)
  }


  _initEffectComposer() {

    this.composer = new EffectComposer(this.renderer.renderer)
    const renderPass = new RenderPass(this.scene, this.camera)
    const effectPass = new EffectPass(
      this.camera, 
      new BloomEffect(),
      new VignetteEffect()
      )

    effectPass.renderToScreen = true;
    
    this.composer.addPass(renderPass)
    this.composer.addPass(effectPass)
    
    this.clock = new THREE.Clock()
        
    this._anim()
  }

  // TODO: combine all render loops
  _anim() {
    this.composer.render(this.clock.getDelta())
    requestAnimationFrame(this._anim.bind(this))
  }
}
