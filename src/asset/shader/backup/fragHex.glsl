uniform vec3 color;
uniform float opacity;
uniform float hover;

varying vec2 vUv;

void main() {

    // vec4 tColor = texture2D( texture, vUv );

    float amount = 0.0;
	amount = (1.0 + sin(hover * 6.0)) * 0.5;
	amount *= 1.0 + sin(hover * 16.0) * 0.5;
	amount *= 1.0 + sin(hover * 19.0) * 0.5;
	amount *= 1.0 + sin(hover * 27.0) * 0.5 * vUv.y;
	amount = pow(amount, 3.0);

    amount *= 0.05;

    vec3 aberration_col;
    aberration_col.r = vec2(vUv.x + amount, vUv.y).x;
    aberration_col.g = color.g;
    aberration_col.b = vec2(vUv.x - amount, vUv.y).y;
    aberration_col *= (1.0 - amount * 0.5);

    vec3 mixed_color = mix(color, aberration_col, 0.5);

    gl_FragColor = vec4( color, opacity );

}
