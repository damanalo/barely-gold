<script setup lang="ts">
import logoUrl from '~/assets/images/barely-gold-mini-logo.png'

const props = withDefaults(defineProps<{
  size?: number
  alt?: string
  rounded?: boolean
}>(), {
  size: 28,
  alt: 'Barely Gold',
  rounded: false
})

const dimension = `${props.size}px`
</script>

<template>
  <img
    :src="logoUrl"
    :alt="props.alt"
    :width="props.size"
    :height="props.size"
    :style="{ width: dimension, height: dimension }"
    :class="[{ 'rounded-md': props.rounded }, 'select-none']"
    draggable="false"
  />
  
</template>


