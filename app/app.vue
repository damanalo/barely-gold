<template>
  <UApp>
    <ComingSoon v-if="showComingSoon" />
    <template v-else>
      <NuxtLayout>
        <NuxtRouteAnnouncer />
        <NuxtPage />
      </NuxtLayout>
    </template>
  </UApp>
</template>

<script setup lang="ts">

const { public: config } = useRuntimeConfig()

const showComingSoon = ref(config.showComingSoon == 'true')

</script>
