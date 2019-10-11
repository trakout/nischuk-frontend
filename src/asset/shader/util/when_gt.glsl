// usage: (do * this) * when_gt(x, y)

float when_gt(float x, float y) {
  return max(sign(x - y), 0.0);
}

#pragma glslify: export(when_gt)