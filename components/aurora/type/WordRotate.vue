<!-- Port of magicui/word-rotate — vertical word cycling with fade/slide -->
<template>
  <div class="word-rotate-wrap">
    <Transition name="word" mode="out-in">
      <span :key="words[index]" class="word-rotate-word">{{ words[index] }}</span>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  words: string[]
  duration?: number
}>(), { duration: 2600 })

const index = ref(0)
let timer = 0

onMounted(() => {
  timer = window.setInterval(() => {
    index.value = (index.value + 1) % props.words.length
  }, props.duration)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.word-rotate-wrap {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
}
.word-rotate-word { display: inline-block; }

.word-enter-active,
.word-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.word-enter-from { opacity: 0; transform: translateY(-18px); }
.word-enter-to   { opacity: 1; transform: translateY(0); }
.word-leave-from { opacity: 1; transform: translateY(0); }
.word-leave-to   { opacity: 0; transform: translateY(18px); }
</style>
