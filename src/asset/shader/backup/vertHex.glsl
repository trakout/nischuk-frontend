uniform float explode;
uniform float hover;

varying vec2 vUv;

#pragma glslify: snoise = require('./util/simplex_noise.glsl')

void main() {

    vUv = uv;
    vec4 offset = vec4(position, 1.0);
    float noise = snoise(vec2(offset.x, offset.z));
    float dist = 0.25;

    // hover
    offset.y += normal.y * dist * hover;
    dist -= 0.05;
    offset.z += normal.z * dist * -hover;

    // explode
    dist += 2.0;
    offset.x += normal.x * dist * explode;
    offset.y += normal.y * dist * explode;
    offset.z += normal.z * dist * explode;

    gl_Position = projectionMatrix * modelViewMatrix * offset;

}
