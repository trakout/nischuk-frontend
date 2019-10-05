uniform vec3 color;
uniform float opacity;
varying float ampNormalized;
void main() {
    vec3 c = color;
    c.g = ampNormalized * ampNormalized * ampNormalized;
    gl_FragColor = vec4(c, opacity);
}
