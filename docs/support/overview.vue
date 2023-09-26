<template>
  <div style="padding: 0 calc((100% - 1200px)/2) " class="vp-doc">
    <h1 style="margin: 20px">
      组件总览 🎉
    </h1>
  </div>
  <div class="overview-components">
    <ComponentCard /><ComponentCard /><ComponentCard />
  </div>
</template>
<script >
export default {
  name: 'Directory'
}
</script>

<script setup>
import ComponentCard from './component/ComponentCard.vue'
import { ref, toRef } from 'vue'
import { useData, useRoute } from 'vitepress'
import { useSidebar } from 'vitepress/theme'

const data = useData()
const route = useRoute()
const { sidebar } = useSidebar()
const sidebarGroups = ref([])
for (let item in sidebar.value) {
  if (sidebar.value[item].items) {
    for (let subItem in sidebar.value[item].items) {
      sidebarGroups.value.push(sidebar.value[item].items[subItem])
    }
  }
}
console.log(sidebarGroups.value)

</script>
