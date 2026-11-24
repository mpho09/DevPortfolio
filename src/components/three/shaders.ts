export const particlesVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aScale;
attribute float aSeed;
varying float vTwinkle;
varying float vSeed;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 1.6) + aSeed * 40.0);
  vSeed = aSeed;
  gl_PointSize = aScale * uPixelRatio * (34.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`

export const particlesFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vTwinkle;
varying float vSeed;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  vec3 col = mix(uColorA, uColorB, vSeed);
  gl_FragColor = vec4(col, a * vTwinkle * 0.9);
}
`
