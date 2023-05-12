<template>
  <div style="padding: 0 calc((100% - 1200px)/2) " class="vp-doc">
    <h1 style="margin: 20px" id="jdk-17-新特性一览" tabindex="-1">
      文章目录 🎉
    </h1>
  </div>
  <div class="main">
    <div class="feed">
      <DirectoryItem v-for="item in sidebarGroups" v-bind="item"/>
    </div>
  </div>
</template>
<script >
export default {
  name: 'Directory'
}
</script>

<script setup>
import DirectoryItem from './component/DirectoryItem.vue'
import { ref, toRef } from 'vue'
import { useData, useRoute } from 'vitepress'
import { useSidebar } from 'vitepress/dist/client/theme-default/composables/sidebar'

const data = useData()

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
