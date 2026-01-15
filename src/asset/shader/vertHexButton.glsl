varying vec2 vUv;
uniform float time;

#pragma glslify: snoise = require('./util/simplex_noise.glsl')

void main() {

    vUv = uv;
    vec4 offset = vec4(position, 1.0);
    // float noise = snoise(vec2(offset.x, offset.z));
    // float dist = 3.25;
    // offset.xyz += normal * dist * time;

    gl_Position = projectionMatrix * modelViewMatrix * offset;

}
