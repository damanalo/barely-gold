<template>
  <UApp>
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
  const colorMode = useColorMode()
  colorMode.preference = 'light'
  colorMode.value = 'light'
</script>
