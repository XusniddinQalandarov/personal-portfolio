<!-- Port of magicui/animated-list — sequential reveal with newest-on-top -->
<template>
  <div class="animated-list">
    <transition-group name="al" tag="div" class="al-track">
      <div v-for="(item, idx) in visible" :key="item._k" class="al-item">
        <component :is="item.vnode" />
      </div>
    </transition-group>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, useSlots, type VNode, Comment } from 'vue'
const props = withDefaults(defineProps<{ delay?: number }>(), { delay: 1000 })
const slots = useSlots()
const allItems = computed(() => {
  const children = slots.default ? slots.default() : []
  // Flatten v-for arrays
  const flat: VNode[] = []
  for (const c of children) {
    if (Array.isArray((c as any).children)) flat.push(...((c as any).children as VNode[]))
    else flat.push(c as VNode)
  }
  return flat.filter((v) => v && (v.type !== Comment)).map((v, i) => ({ _k: `al-${i}`, vnode: () => v }))
})
const shown = ref(0)
const visible = computed(() => allItems.value.slice(0, shown.value + 1).slice().reverse())
let timer = 0
function step() {
  if (shown.value < allItems.value.length - 1) {
    timer = window.setTimeout(() => { shown.value += 1; step() }, props.delay)
  }
}
onMounted(() => {
  if (typeof window === 'undefined') return
  step()
  onBeforeUnmount(() => clearTimeout(timer))
})
</script>
<style scoped>
.animated-list { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; }
.al-track { display: flex; flex-direction: column; gap: 16px; width: 100%; }
.al-item { width: 100%; }
.al-enter-from { opacity: 0; transform: scale(0); transform-origin: top; }
.al-enter-active { transition: transform 0.45s cubic-bezier(0.34, 1.36, 0.64, 1), opacity 0.45s ease; }
.al-enter-to { opacity: 1; transform: scale(1); }
.al-leave-from { opacity: 1; transform: scale(1); }
.al-leave-active { transition: transform 0.3s ease, opacity 0.3s ease; }
.al-leave-to { opacity: 0; transform: scale(0); }
.al-move { transition: transform 0.45s cubic-bezier(0.34, 1.36, 0.64, 1); }
</style>
