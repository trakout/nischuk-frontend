import * as animate from 'gsap-promise'
import * as base64 from 'base64-lite'

import IconEmail from '../../../asset/img/inline/email.svg?name=IconEmail'
import IconGithub from '../../../asset/img/inline/github.svg?name=IconGithub'
import IconTwitter from '../../../asset/img/inline/twitter.svg?name=IconTwitter'
import IconLinkedin from '../../../asset/img/inline/linkedin.svg?name=IconLinkedin'

import fragAlphaTexture from 'webpack-glsl-loader!../../../asset/shader/fragAlphaTexture.glsl?name=fragAlphaTexture'
import vertAlphaTexture from 'webpack-glsl-loader!../../../asset/shader/vertAlphaTexture.glsl?name=vertAlphaTexture'

const linkedin = 'https://www.linkedin.com/in/nischuk/'
const twitter = 'https://twitter.com/trakout'
const email = 'mailto:trakout@gmail.com'
const github = 'https://github.com/trakout'

const DELAY = 2

const COLOR_RED = 0xe63531
const COLOR_OFFBLACK = 0x273E45
const COLOR_BLACK = 0x122430
const COLOR_OFFWHITE = 0xFFFCE2


export default class HexGenerator {
  constructor(renderer) {
    this.renderer = renderer
    this.scene = renderer._getScene()
    this.camera = renderer._getCamera()
    this.controls = renderer._getControls()

    this.hexGroup = new THREE.Group()
    this.gridArr = null
    this.window = this._getWindowSize()
    this.offset = {
      x: 75,
      y: 29
    }

    this.iconMap = {
      'twitter': IconTwitter,
      'linkedin': IconLinkedin,
      'email': IconEmail,
      'github': IconGithub
    }

    this.hrefMap = {
      'twitter': twitter,
      'linkedin': linkedin,
      'email': email,
      'github': github
    }

    this._generateHexGrid()
  }


  _mouseIn(item) {
    if (!item.children[0].material.materials) {
      animate.to(item.children[0].material.color, 0.5, {r: 237/255, g: 113/255, b: 102/255})
      animate.to(item.children[0].material, 0.5, {opacity: 0.5})
    }

    animate.to(item.children[1].material, 0.5, {opacity: 0.5})

    if (item.uColors) {
      animate.to(item.uColors.texture_color.value, 0.2, {r: 18/255, g: 36/255, b: 48/255})
      animate.to(item.uColors.background_color.value, 0.2, {r: 237/255, g: 113/255, b: 102/255})
    }
  }

  _mouseOut(item) {
    if (!item.children[0].material.materials) {
      animate.to(item.children[0].material.color, 0.5, {r: 1, g: 252/255, b: 226/255})
      animate.to(item.children[0].material.color, 0.8, {r: 39/255, g: 62/255, b: 69/255, delay: DELAY, ease: Elastic.easeOut.config(1, 0.5)})
    }

    animate.to(item.children[0].material, 0.5, {opacity: 1, delay: DELAY})
    animate.to(item.children[1].material, 0.5, {opacity: 0, delay: DELAY})

    if (item.uColors) {
      animate.to(item.uColors.texture_color.value, 0.2, {r: 1, g: 252/255, b: 226/255, delay: DELAY})
      animate.to(item.uColors.background_color.value, 0.2, {r: 230/255, g: 53/255, b: 49/255, delay: DELAY})
    }
  }


  _hexMaterial(type, obj) {
    let material = null

    if (type === 'multi') {
      material = []
      for (let i = 0; i < 8; i++) {
        material.push(
          new THREE.MeshBasicMaterial({
            color: obj.button ? COLOR_RED : COLOR_OFFBLACK,
            transparent: true,
            opacity: 1
          })
        )
      }
      material = new THREE.MultiMaterial(material)
    } else {
      material = new THREE.MeshBasicMaterial({
        color: obj.button ? COLOR_RED : COLOR_OFFBLACK,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
        transparent: true,
        opacity: 1
      })
    }

    return material
  }


  _genSingleHex(obj, gridSize) {

    let hexMesh = new THREE.Object3D()
    let singleMeshGroup = new THREE.Group()
    let hexGeometry = new THREE.CylinderBufferGeometry(1, 1, 0.5, 6)

		hexMesh.add( new THREE.Mesh(
			new THREE.Geometry(),
      obj.button ? this._hexMaterial('multi', obj) : this._hexMaterial('normal', obj)
		))

    hexMesh.add(new THREE.LineSegments(
      new THREE.Geometry(),
      new THREE.LineBasicMaterial({
       color: COLOR_OFFBLACK,
       linewidth: 1,
       transparent: true,
       opacity: 0,
       side: THREE.BackSide,
       depthTest: false
     })
    ))

  	hexMesh.children[ 0 ].geometry.dispose()
  	hexMesh.children[ 1 ].geometry.dispose()

  	hexMesh.children[ 0 ].geometry = hexGeometry
    hexMesh.children[ 1 ].geometry = new THREE.EdgesGeometry(hexGeometry)

    hexMesh.position.x = obj.x
    hexMesh.position.y = obj.y

  	let outlineMesh = new THREE.Mesh(
      hexGeometry,
      new THREE.MeshBasicMaterial({
        color: COLOR_BLACK,
        side: THREE.BackSide
      })
    )

  	outlineMesh.position.x = hexMesh.position.x
    outlineMesh.position.y = hexMesh.position.y
    outlineMesh.position.z = hexMesh.position.z
  	outlineMesh.scale.multiplyScalar(1.05)

    if (hexMesh.rotation.x < 0) {
      hexMesh.rotation.x = Math.PI / -2
      outlineMesh.rotation.x = Math.PI / -2
    } else {
      hexMesh.rotation.x = Math.PI / 2
      outlineMesh.rotation.x = Math.PI / 2
    }

    if (hexMesh.rotation.y < 0) {
      hexMesh.rotation.y = Math.PI / 2
      outlineMesh.rotation.y = Math.PI / 2
    } else {
      hexMesh.rotation.y = Math.PI / -2
      outlineMesh.rotation.y = Math.PI / -2
    }

    singleMeshGroup.add(outlineMesh)
    singleMeshGroup.add(hexMesh)

    hexMesh.mouse = {
      in: this._mouseIn.bind(this),
      out: this._mouseOut.bind(this),
      href: obj.type ? this.hrefMap[obj.type] : null
    }

    hexMesh.showHover = obj.button ? true : false
    hexMesh.originalColor = obj.button ? COLOR_RED : null

    if (obj.type) {
      this._drawSvg(this.hexGroup, singleMeshGroup, hexMesh, obj.type)
    } else {
      this.hexGroup.add(singleMeshGroup)
    }

    this.renderer._setMouseWatcher(hexMesh)
  }


  _getWindowSize() {
    return {
      x: 1400,
      y: 900
    }
  }


  _drawSvg(group, meshGroup, hexMesh, type) {
    let canvas = document.createElement("canvas")
    // var svgSize = svg.getBoundingClientRect();
    // canvas.width = svgSize.width;
    // canvas.height = svgSize.height;
    canvas.width = 256
    canvas.height = 256
    var ctx = canvas.getContext("2d")

    let img = document.createElement('img')
    img.setAttribute(
      'src', 'data:image/svg+xml;base64,' +
      base64.btoa(unescape(encodeURIComponent(this.iconMap[type])))
    )

    img.onload = () => {
      ctx.translate( canvas.width / 2, canvas.height / 2 )
      ctx.rotate(Math.PI)
      ctx.translate( -canvas.width / 2, -canvas.height / 2 )


      if (type === 'twitter') {
        ctx.scale(0.6, 0.6)
        ctx.translate(85, 85)
      }
      if (type === 'email') {
        ctx.scale(0.5, 0.5)
        ctx.translate(134, 128)
      }

      if (type === 'linkedin') {
        ctx.scale(0.5, 0.5)
        ctx.translate(130, 120)
      }

      if (type === 'github') {
        ctx.scale(0.5, 0.5)
        ctx.translate(125, 128)
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      var texture = new THREE.Texture(canvas)

      texture.needsUpdate = true

      let material = meshGroup.children[1].children[0].material.materials[1]

      hexMesh.uColors = {
        background_color: { type: "c", value: new THREE.Color( COLOR_RED ) },
        texture_color: { type: "c", value: new THREE.Color( COLOR_OFFWHITE ) }
      }

      // material
      material = new THREE.ShaderMaterial({
        uniforms: {
          background_color: hexMesh.uColors.background_color,
          texture_color: hexMesh.uColors.texture_color,
          texture: { type: "t", value: texture }
        },
        vertexShader: vertAlphaTexture,
        fragmentShader: fragAlphaTexture
      })

      meshGroup.children[1].children[0].material.materials[1] = material
      group.add(meshGroup)
    };
  }


  _getGridSizes() {
    const rowCount = Math.ceil(this.window.x * 1.2 / this.offset.x)
    const colCount = Math.ceil(this.window.y * 1.4 / this.offset.y + 1)

    return ({
      row: rowCount,
      col: colCount,
      x: rowCount * 75,
      y: colCount * 21.75
    })
  }


  _generateHexGrid() {
    const gridSize = this._getGridSizes()
    const zOffset = 5
    this.gridArr = []

    let middle = {
      x: Math.floor(gridSize.row / 2),
      y: Math.floor(gridSize.col / 2) + 5
    }

    if (this.window.x <= 360) {
      middle.x--
    }

    for (let col = 0, colLen = gridSize.col; col < colLen; col++) {
      for (let row = 0, rowLen = gridSize.row; row < rowLen; row++) {
        let lastIndex = {
          y: col * 0.45 * 2,
          x: (row + (col % 2 ? 0.5 : 0)) * 3.1
          // z: (zOffset * (Math.abs((col - Math.floor(colLen / 2))) / Math.floor(colLen / 2)) + zOffset * (Math.abs((row - Math.floor(rowLen / 2))) / Math.floor(rowLen / 2))) / 2
        }

        if (col == middle.y - 8 && row == middle.x // linkedin
        || col == middle.y - 10 && row == middle.x - 1 // email
        || col == middle.y - 12 && row == middle.x  // github
        || col == middle.y - 6 && row == middle.x - 1) { // twitter
          lastIndex.button = true

          if (col == middle.y - 8 && row == middle.x) {
            lastIndex.href = linkedin
            lastIndex.type = 'linkedin'
          }
          if (col == middle.y - 10 && row == middle.x - 1) {
            lastIndex.href = email
            lastIndex.type = 'email'
          }
          if (col == middle.y - 12 && row == middle.x) {
            lastIndex.href = github
            lastIndex.type = 'github'
          }
          if (col == middle.y - 6 && row == middle.x - 1) {
            lastIndex.href = twitter
            lastIndex.type = 'twitter'
          }
        }

        this.gridArr.push(lastIndex)
      }
    }

    // console.log(this.gridArr)

    // use renderer._setCamera
    // this.camera.position.x = (gridSize.row / 2 + (gridSize.col / 2 % 2 ? 0.5 : 0)) * 3.05
    // this.camera.position.y = (gridSize.col / 2 * 0.46 * 2)
    // this.camera.position.z = 20

    // this.renderer._setCamera({z: 20})

    // if (this.controls) {
    //   this.controls.target.set(
    //     this.camera.position.x,
    //     this.camera.position.y,
    //     0
    //   )

    //   this.controls.update()
    // }


    this.gridArr.map((el) => {
      this._genSingleHex(el, gridSize)
    })

    // let light = new THREE.PointLight( 0xf2f2f2, 10, 100 )
    // light.position.set( 0, 0, 20 )
    // this.scene.add( light )

    this.scene.add(this.hexGroup)

    // this.scene.fog = new THREE.Fog( COLOR_OFFBLACK, 20, 40 )

  }
}
