<!-- Port of magicui/number-ticker — counts from startValue to value on in-view -->
<template>
  <span ref="el" class="number-ticker" />
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
const props = withDefaults(defineProps<{
  value: number; startValue?: number; direction?: 'up' | 'down'; delay?: number; decimalPlaces?: number
}>(), { startValue: 0, direction: 'up', delay: 0, decimalPlaces: 0 })
const el = ref<HTMLSpanElement | null>(null)
let target = props.direction === 'down' ? props.startValue : props.value
let current = props.direction === 'down' ? props.value : props.startValue
let v = 0, rafId = 0, started = false
const stiffness = 100, damping = 60
function fmt(n: number) {
  return Intl.NumberFormat('en-US', {
    minimumFractionDigits: props.decimalPlaces, maximumFractionDigits: props.decimalPlaces,
  }).format(Number(n.toFixed(props.decimalPlaces)))
}
function tick() {
  // Critically-damped spring approximation
  const k = stiffness * 0.0001
  const c = damping * 0.001
  const a = (target - current) * k - v * c
  v += a
  current += v
  if (el.value) el.value.textContent = fmt(current)
  if (Math.abs(target - current) > 0.001 || Math.abs(v) > 0.001) rafId = requestAnimationFrame(tick)
  else { current = target; if (el.value) el.value.textContent = fmt(current); rafId = 0 }
}
function start() {
  if (started) return
  started = true
  setTimeout(() => { rafId = requestAnimationFrame(tick) }, props.delay * 1000)
}
onMounted(() => {
  if (typeof window === 'undefined') return
  if (el.value) el.value.textContent = fmt(current)
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { start(); io.disconnect() }
  }, { rootMargin: '0px' })
  io.observe(el.value!)
  onBeforeUnmount(() => { cancelAnimationFrame(rafId); io.disconnect() })
})
watch(() => props.value, (n) => { target = props.direction === 'down' ? props.startValue : n; if (started && !rafId) rafId = requestAnimationFrame(tick) })
</script>
<style scoped>
.number-ticker { display: inline-block; letter-spacing: 0.01em; font-variant-numeric: tabular-nums; color: var(--text); }
</style>
