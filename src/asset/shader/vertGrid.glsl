uniform float size;
uniform float time;
uniform float tWidth;
uniform float tHeight;
uniform float amplitude;
uniform float waveLength;
varying float ampNormalized;

void main() {
    vec3 p = position;
    vec3 yPoint = vec3(0.0, p.y, p.z);
    float wLength = 1. / waveLength;
    if (distance(yPoint, p.xyz) > tWidth / 4.)
    {
        p.y = abs(sin(position.x * wLength + time) * cos(position.z * wLength  + time) * amplitude);
    }

    ampNormalized = abs(-amplitude + p.y) / (amplitude * 2.0);
  	vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );
    gl_PointSize = size * ( 300.0 / length( mvPosition.xyz ) );
    gl_Position = projectionMatrix * mvPosition;
}
