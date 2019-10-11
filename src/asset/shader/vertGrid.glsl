uniform float size;
uniform float time;
uniform vec2 limits;
uniform float speed;
uniform float tWidth;
uniform float tHeight;
uniform float amplitude;
uniform float waveLength;

attribute float moveable;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float ampNormalized;


#pragma glslify: when_gt = require('./util/when_gt.glsl')
#pragma glslify: when_lt = require('./util/when_lt.glsl')
#pragma glslify: snoise = require('./util/simplex_noise.glsl')


float waveCalc(float waveLength, float noiseFactor) {
  return abs(
    sin(position.x * waveLength + time / 3.) * 
    cos(position.z * waveLength  + time / 3.0) * 
    amplitude * noiseFactor
  );
}


void main() {
    
    vUv = uv;
    vec3 p = position;
    float dist = speed * time;
    float limLen = limits.y - limits.x;
    float noise = snoise(vec2(p.x, p.z));

    p.z = mod((p.z + dist) - limits.x, limLen) + limits.x;
    
    vec3 yPoint = vec3(0.0, p.y, p.z);
    vec3 zPoint = vec3(p.x, p.y, 0.0);

    p.y = waveCalc(1.0 / waveLength, noise) * 
      when_gt(distance(yPoint, p.xyz), tWidth / 4.0) * 
      when_lt(distance(zPoint, p.xyz), tHeight / 2.2);

      

    // when_gt(distance(xPoint, p.xyz), tHeight - 300.0); // make things comes down the middle
    vPosition = (projectionMatrix * modelMatrix * vec4(p, 1.0)).xyz;
    vNormal = (projectionMatrix * modelMatrix * vec4(normal, 0.0)).xyz;

    ampNormalized = abs(-amplitude + p.y) / (amplitude);
  	vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );
    gl_PointSize = size * ( 300.0 * noise / length( mvPosition.xyz ) );
    gl_Position = projectionMatrix * mvPosition;
}