import './BlackTriangle.styl'

export default class BlackTriangle {
  constructor(selector) {
    console.log('hey')
    // this.angle = 0;
    //
    // this.innerEl = document.createElement('div');
    // this.innerEl.className = "BlackTriangle-inner";
    //
    // this.el = document.querySelector(selector)
    // this.el.className = "BlackTriangle";
    // this.el.appendChild(this.innerEl);
  }

  rotate(amount) {
    this.angle = (this.angle + amount) % 360;
  }

  render() {
    this.innerEl.style.transform = `rotate(${this.angle}deg)`;
  }
}
