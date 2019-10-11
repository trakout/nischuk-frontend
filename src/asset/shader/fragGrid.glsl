// #define MAX_POINT_LIGHTS 1

uniform vec3 color;
uniform sampler2D pointTexture;
uniform float opacity;
// uniform vec3 pointLightColor[MAX_POINT_LIGHTS];
// uniform vec3 pointLightPosition[MAX_POINT_LIGHTS];
// uniform float pointLightDistance[MAX_POINT_LIGHTS];

struct PointLight {
  vec3 color;
  vec3 position; // light position, in camera coordinates
  float distance; // used for attenuation purposes. Since
                  // we're writing our own shader, it can
                  // really be anything we want (as long
                  // as we assign it to our light in its
                  // "distance" field
};
 
uniform PointLight pointLights[NUM_POINT_LIGHTS];

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float ampNormalized;


void main() {
    vec3 c = color;
    float ampColor = ampNormalized * ampNormalized * ampNormalized;

    c.r = clamp(ampColor, 0.47, 0.67);
    c.g = clamp(ampColor, 0.23, 0.83);
    c.b = clamp(ampColor, 0.71, 0.78);

    vec4 lights = vec4(0.0, 0.0, 0.0, 1.0);

    #if NUM_POINT_LIGHTS > 0
        for(int i = 0; i < NUM_POINT_LIGHTS; i++) {
            vec3 lightVector = normalize(vPosition - pointLights[i].position);
            lights.rgb += clamp(dot(-lightVector, vNormal), 0.0, 1.0) * pointLights[i].color;
        }
    #endif

    // gl_FragColor = texture2D(pointTexture, vUv);
    gl_FragColor = vec4(c, opacity); //* lights;
}
