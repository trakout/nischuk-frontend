import fragGrid from 'webpack-glsl-loader!../../asset/shader/fragGrid.glsl?name=fragGrid'
import vertGrid from 'webpack-glsl-loader!../../asset/shader/vertGrid.glsl?name=vertGrid'


export default class Grid {
  constructor(renderer) {
    this.renderer = renderer
    this.scene = renderer._getScene()
    this.camera = renderer._getCamera()
    this.controls = renderer._getControls()

    this._modPlaneBufferGeometry()
    this._initGrid()
  }


  _initGrid() {
    let planeData = {
      width: 500,
      height: 500,
      segmentsX: 100,
      segmentsY: 100
    }

    let planeGeom = new THREE.PlaneBufferGeometry(
      planeData.width,
      planeData.height,
      planeData.segmentsX,
      planeData.segmentsY
    ).toGrid()

    console.log(planeGeom)

    let seaDown = new THREE.LineSegments(planeGeom, new THREE.ShaderMaterial({
      uniforms: {
        color: {
          value: new THREE.Color("blue")
        },
        opacity: {
          value: .75
        },
        time: {
          value: 0
        },
        amplitude: {
          value: 20
        },
        waveLength: {
          value: Math.PI * 10
        },
        tWidth: {
        	value: planeGeom.parameters.width
        },
        tHeight: {
        	value: planeGeom.parameters.height
        }
      },
      vertexShader: vertGrid,
      fragmentShader: fragGrid,
      transparent: true
    }))

    let seaDownPoints = new THREE.Points(planeGeom, new THREE.ShaderMaterial({
      uniforms: {
        color: {
          value: new THREE.Color("maroon").multiplyScalar(1.25)
        },
        opacity: {
          value: 1
        },
        size: {
          value: 1.25
        },
        time: {
          value: 0
        },
        amplitude: {
          value: 20
        },
        waveLength: {
          value: Math.PI * 10
        },
        tWidth: {
        	value: planeGeom.parameters.width
        },
        tHeight: {
        	value: planeGeom.parameters.height
        }
      },
      vertexShader: vertGrid,
      fragmentShader: fragGrid,
      transparent: false
    }))

    planeGeom.rotateX(-Math.PI * 0.5)
    this.scene.add(seaDown)
    this.scene.add(seaDownPoints)

    let clock = new THREE.Clock()
    var t = 0
    var delta = 0

    let render = () => {
      requestAnimationFrame(render)
      delta = clock.getDelta()
      t += delta

      seaDown.material.uniforms.time.value = t
      seaDownPoints.material.uniforms.time.value = t
      this.scene.rotation.y += delta * 0.05
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
