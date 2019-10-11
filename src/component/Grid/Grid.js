import fragGrid from '../../asset/shader/fragGrid.glsl'
import vertGrid from '../../asset/shader/vertGrid.glsl'


export default class Grid {
  constructor(renderer) {
    this.renderer = renderer
    this.config = renderer._getConfig()
    this.scene = renderer._getScene()
    this.camera = renderer._getCamera()
    this.controls = renderer._getControls()

    this._modPlaneBufferGeometry()
    this._initGrid()
  }


  _initGrid() {
    let planeData = this.config.planeData

    let planeGeom = new THREE.PlaneBufferGeometry(
      planeData.width,
      planeData.height,
      planeData.segmentsX,
      planeData.segmentsY
    ).toGrid()

    // var division = 40;
    const limit = planeData.height / 2

    let moveable = []
    for (let i = 0, iLen = planeGeom.attributes.normal.count + 1; i <= iLen; i++) {
      moveable.push(1, 1, 1, 1)
    }

    planeGeom.addAttribute(
      'moveable',
      new THREE.BufferAttribute(new Uint8Array(moveable), 1)
    )

    let underGrid = new THREE.Mesh(
      new THREE.PlaneGeometry(
        planeData.width,
        planeData.height,
        planeData.segmentsX,
        planeData.segmentsY
      ),
      new THREE.MeshBasicMaterial({color: planeData.colorSolid})
    )

    var light = new THREE.PointLight( 0xffffff, 0.3, 600 );
    // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    // var light = new THREE.Mesh( geometry, material );

    light.position.set( 0, 30, -2 )
    this.scene.add( light );



    let gridUniforms = Object.assign(
      THREE.UniformsUtils.merge([
        THREE.UniformsLib[ 'ambient' ],
        THREE.UniformsLib[ 'lights' ]
      ]), 
      {
        color: {
          value: new THREE.Color(planeData.color)//.multiplyScalar(3)
        },
        opacity: {
          value: 0.75
        },
        time: {
          value: 0
        },
        amplitude: {
          value: planeData.waveAmplitude
        },
        waveLength: {
          value: Math.PI * 10
        },
        tWidth: {
          value: planeGeom.parameters.width
        },
        tHeight: {
          value: planeGeom.parameters.height
        },
        limits: {
          value: new THREE.Vector2(-limit, limit)
        },
        speed: {
          value: planeData.speed
        }
      }
    )
    
    let grid = new THREE.LineSegments(planeGeom, new THREE.ShaderMaterial({
      uniforms: gridUniforms,
      vertexShader: vertGrid,
      fragmentShader: fragGrid,
      // transparent: false,
      lights: true
    }))

    console.log(grid.material.uniforms)

    // let gridPoints = new THREE.Points(planeGeom, new THREE.ShaderMaterial({
    //   uniforms: {
    //     color: {
    //       value: new THREE.Color(0xe240ff)
    //     },
    //     opacity: {
    //       value: 1
    //     },
    //     size: {
    //       value: 2.26
    //     },
    //     time: {
    //       value: 0
    //     },
    //     amplitude: {
    //       value: planeData.waveAmplitude
    //     },
    //     waveLength: {
    //       value: Math.PI * 10
    //     },
    //     tWidth: {
    //     	value: planeGeom.parameters.width
    //     },
    //     tHeight: {
    //     	value: planeGeom.parameters.height
    //     },
    //     limits: {
    //       value: new THREE.Vector2(-limit, limit)
    //     },
    //     speed: {
    //       value: planeData.speed
    //     }
    //   },
    //   vertexShader: vertGrid,
    //   fragmentShader: fragGrid,
    //   // lights: true
    // }))

    let hemiLight = new THREE.HemisphereLight( 0xf4b949, 0xf65bcb, 0.9 )
    // hemiLight.color.setHSV( 0.6, 0.75, 0.5 )
    // hemiLight.groundColor.setHSV( 0.095, 0.5, 0.5 )
    hemiLight.position.set( 0, 60, 0 )
    let helper = new THREE.HemisphereLightHelper( hemiLight, 5 )
    this.scene.add( hemiLight )

    // this.scene.add(new THREE.AmbientLight(0xcccccc));
    // this.scene.add(new THREE.DirectionalLight(0xffffff));


    const sunWidth = 160
    let sunGeometry = new THREE.SphereGeometry( sunWidth, 32, 32 )
    let sunMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff } )
    let sunSphere = new THREE.Mesh( sunGeometry, sunMaterial )
    sunSphere.position.set(0, 80, -(planeData.height / 2) - (sunWidth))
    this.scene.add( sunSphere )

    planeGeom.rotateX(-Math.PI * 0.5)
    underGrid.rotateX(-Math.PI * 0.5)
    underGrid.position.y -= 1
    this.scene.add(underGrid)
    this.scene.add(grid)
    // this.scene.add(gridPoints)

    this.renderer._setCamera({y: 7, z: (planeData.height / 2)})

    let clock = new THREE.Clock()
    let t = 0
    let delta = 0

    let render = () => {
      requestAnimationFrame(render)
      delta = clock.getDelta()
      t += delta

      grid.material.uniforms.time.value = t
      // gridPoints.material.uniforms.time.value = t
      // this.scene.rotation.y += delta * 0.05
    }

    render()
  }


  _modPlaneBufferGeometry() {
    Object.assign(THREE.PlaneBufferGeometry.prototype, {
      toGrid: function() {
        let segmentsX = this.parameters.widthSegments || 1;
        let segmentsY = this.parameters.heightSegments || 1;
        let indices = [];
        for (let i = 0; i < segmentsY + 1; i++) {
          let index11 = 0;
          let index12 = 0;
          for (let j = 0; j < segmentsX; j++) {
            index11 = (segmentsX + 1) * i + j;
            index12 = index11 + 1;
            let index21 = index11;
            let index22 = index11 + (segmentsX + 1);
            indices.push(index11, index12);
            if (index22 < ((segmentsX + 1) * (segmentsY + 1) - 1)) {
              indices.push(index21, index22);
            }
          }
          if ((index12 + segmentsX + 1) <= ((segmentsX + 1) * (segmentsY + 1) - 1)) {
            indices.push(index12, index12 + segmentsX + 1);
          }
        }
        this.setIndex(indices);
        return this;
      }
    })
  }


}
