<template>
  <div class="border-beam" aria-hidden="true" />
</template>

<style scoped>
@property --beam-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
.border-beam {
  position: absolute; inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: conic-gradient(from var(--beam-angle, 0deg), transparent 50%, var(--amber) 65%, var(--cyan) 80%, transparent 95%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: rotateBeam 6s linear infinite;
  pointer-events: none;
  z-index: 1;
}
@keyframes rotateBeam { to { --beam-angle: 360deg; } }
@media (prefers-reduced-motion: reduce) { .border-beam { animation: none; } }
</style>
