uniform vec3 background_color;
uniform vec3 texture_color;
uniform sampler2D texture;

varying vec2 vUv;

void main() {

    vec4 tColor = texture2D( texture, vUv );

    gl_FragColor = vec4( mix( background_color, texture_color.rgb, tColor.a ), 1.0 );

}
