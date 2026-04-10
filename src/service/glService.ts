import hexVertex from '../asset/shader/hexVertex.glsl?raw';
import hexFragment from '../asset/shader/hexFragment.glsl?raw';

export const loadShader = async (path: string) => fetch(path).then(res => res.text());

export const getShaders = () => ({ vertex: hexVertex, fragment: hexFragment });
