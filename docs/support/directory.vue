<template>
  <div class="main">
    <div class="feed">
      <DirectoryItem v-for="item in sidebarGroups" title="a"/>
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
import { defineProps } from 'vue'
const props = defineProps({
  sidebarGroups: {
    type: Array,
    default: []
  }
})

console.log(props.sidebarGroups)
</script>
