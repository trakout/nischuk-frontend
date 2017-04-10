import { MeshLine, MeshLineMaterial } from 'three.meshline'

import IconEmail from 'babel?presets[]=es2015&presets[]=react!svg-react!../../../asset/img/email.svg?name=IconEmail'
import IconGithub from 'babel?presets[]=es2015&presets[]=react!svg-react!../../../asset/img/github.svg?name=IconGithub'
import IconTwitter from 'babel?presets[]=es2015&presets[]=react!svg-react!../../../asset/img/twitter.svg?name=IconTwitter'
import IconLinkedin from 'babel?presets[]=es2015&presets[]=react!svg-react!../../../asset/img/linkedin.svg?name=IconLinkedin'

const linkedin = 'https://www.linkedin.com/in/nischuk/'
const twitter = 'https://twitter.com/trakout'
const email = 'mailto:trakout@gmail.com'
const github = 'https://github.com/trakout'


export default class HexGenerator {
  constructor(renderer) {
    this.renderer = renderer._getRenderer()
    this.scene = renderer._getScene()
    this.camera = renderer._getCamera()

    this.gridArr = null
    this.window = this._getWindowSize()
    this.offset = {
      x: 75,
      y: 29
    }

    this._generateHexGrid()
  }


  _genSingleHex(obj) {
    let geometry = new THREE.CylinderGeometry( 1, 1, 1, 6 )
    geometry.vertexColors = new THREE.Color(0xffffff)


    let material = new THREE.MeshBasicMaterial({
      // color: 0x273e45
      vertexColors: THREE.VertexColors,
      color: 0x273e45,
      transparent: true,
      opacity: 1,
      depthTest: false
    })

    // material.opacity = 0.1


    if (obj.button) {
      material.color = new THREE.Color(0xe63531)
    }

    let cube = new THREE.Mesh( geometry, material )

    cube.position.x = obj.x
    cube.position.y = obj.y

    cube.rotation.x = Math.PI / 2
    cube.rotation.y = Math.PI / 2


    // cube.rotation.y = Math.PI * 0.15


    // wireframe
    let geo = new THREE.EdgesGeometry(cube.geometry) // or WireframeGeometry
    let mat = new THREE.LineBasicMaterial({
      color: 0x122430,
      linewidth: 1,
      transparent: true,
      opacity: 1
      // depthTest: false
    })
    let wireframe = new THREE.LineSegments(geo, mat)

    wireframe.position.y = 1

    console.log(wireframe.position.z)

    cube.add(wireframe)

    this.scene.add(cube)


  }


  _getWindowSize() {
    return {
      x: 1400,
      y: 900
    }
  }


  _getGridSizes() {
    const rowCount = Math.ceil(this.window.x * 1.2 / this.offset.x)
    const colCount = Math.ceil(this.window.y * 1.4 / this.offset.y + 1)

    return ({
      x: rowCount * 75,
      y: colCount * 21.75
    })
  }


  _generateHexGrid() {
    const gridSize = this._getGridSizes()
    this.gridArr = []

    const rowCount = Math.ceil(this.window.x * 1.2 / this.offset.x)
    const colCount = Math.ceil(this.window.y * 1.4 / this.offset.y + 1)

    let middle = {
      x: Math.floor(rowCount / 2),
      y: Math.floor(colCount / 2) + 5
    }

    if (this.window.x <= 360) {
      middle.x--
    }

    for (let col = 0, colLen = colCount; col < colLen; col++) {
      for (let row = 0, rowLen = rowCount; row < rowLen; row++) {
        let lastIndex = {
          y: col * 0.44 * 2,
          x: (row + (col % 2 ? 0.5 : 0)) * 3.1
        }

        if (col == middle.y - 8 && row == middle.x // linkedin
        || col == middle.y - 10 && row == middle.x - 1 // email
        || col == middle.y - 12 && row == middle.x  // github
        || col == middle.y - 6 && row == middle.x - 1) { // twitter
          lastIndex.button = true
        //
        //   if (middle.y + 2 && row == middle.x) {
        //     lastIndex.href = linkedin
        //     lastIndex.type = 'linkedin'
        //   }
        //   if (col == middle.y && row == middle.x - 1) {
        //     lastIndex.href = email
        //     lastIndex.type = 'email'
        //   }
        //   if (col == middle.y - 2 && row == middle.x + 1) {
        //     lastIndex.href = github
        //     lastIndex.type = 'github'
        //   }
        //   if (col == middle.y + 4 && row == middle.x - 1) {
        //     lastIndex.href = twitter
        //     lastIndex.type = 'twitter'
        //   }
        }

        this.gridArr.push(lastIndex)
      }
    }

    console.log(this.gridArr)
    this.camera.position.y = (colCount / 2 * 0.46 * 2)
    this.camera.position.x = (rowCount / 2 + (colCount / 2 % 2 ? 0.5 : 0)) * 3.05

    this.gridArr.map((el) => {
      this._genSingleHex(el)
    })
    //   let hexTag = <HexSingle button={el.button} />
    //
    //   if (el.button) {
    //     hexTag = (
    //       <a target="_blank" onClick={this._trackSocial.bind(this, el.type)} className="block" href={el.href}>
    //         <HexSingle button={el.button} />
    //         {this._getSvg(el.type)}
    //       </a>
    //     )
    //   }
    //
    //   return (
    //     <div key={el.key} style={el.style} className="single">
    //       {hexTag}
    //     </div>
    //   )
    // })
  }
}
