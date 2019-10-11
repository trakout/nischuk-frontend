// usage: (do * this) * when_lt(x, y)

float when_lt(float x, float y) {
  return max(sign(y - x), 0.0);
}

#pragma glslify: export(when_lt)