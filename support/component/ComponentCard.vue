<template>
  <div class="component">
    <a :href="link">
    <div class="image">
      <img draggable="false" :src="src ? src : '/bg/jdk17.png'" class="out">
      <div class="info">
        <div class="title" style="opacity: 1; transition: all 0.2s ease 0s;">Title</div>
        <div class="cats" style="opacity: 1; transition: all 0.2s ease 0s;">Copyright © 2023-present Fan Xuebin</div>
      </div>
    </div>
    </a>
  </div>
</template>
<script>
export default {
  name: 'ComponentCard'
}
</script>
<script setup>
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  src: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  }
})

console.log(props)



</script>

<style scoped>

</style>