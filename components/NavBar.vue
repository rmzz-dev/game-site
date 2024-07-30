<script setup lang="ts">
const router = useRouter();

const routes = router.getRoutes();

const items = computed(() =>
  routes
    .filter((route) => route.meta.nav)
    .map((route) => ({
      label: route.name as string,
      route: route.path,
    }))
);
</script>

<template>
  <nav>
    <Menubar :model="items" class="rounded-t-none">
      <template #start>
        <FontAwesomeIcon icon="fa-solid fa-gamepad" size="xl" />
      </template>
      <template #end>
        <!-- <FontAwesomeIcon icon="fa-solid fa-sun" />
        <FontAwesomeIcon icon="fa-solid fa-moon" /> -->
      </template>
      <template #item="{ item, props, hasSubmenu }">
        <NuxtLink
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          class="p-menubar-item-link"
        >
          <span class="p-menubar-item-label">
            <FontAwesomeIcon v-if="item.icon" :icon="item.icon" size="lg" />
            {{ item.label }}</span
          >
        </NuxtLink>
        <!-- 
        TODO: Add support for submenus and non route items
        -->
      </template>
    </Menubar>
  </nav>
</template>

<style scoped></style>
