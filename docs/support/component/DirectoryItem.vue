<template>
  <div class="feed-display">
<!--    <a href="#">
      <span class="feed-title">
        AAAAAAAAAAA
      </span>
      <img src="https://pic2.zhimg.com/v2-58d51f508827b08c7eb2fec472f751a7_1440w.jpg" alt="Quiet"/>
    </a>
    <div class="feed-meat">
      <div class="meat-info">
        <div class="info-auth">
          <a href="">
            a
          </a>
        </div>
        <div class="info-data">
          aaa
        </div>
      </div>
      <div class="meat-type"></div>
    </div>-->
    <a :href="link">
    <div class="image">
      <img draggable="false" :src="src ? src : '/rabbit.jpg'" class="out">
      <div class="overlay" style="opacity: 1; transition: all 0.2s ease 0s;"></div>
      <div class="cats" style="opacity: 1; transition: all 0.2s ease 0s;">Copyright © 2023-present Fan Xuebin</div>
      <div class="title" style="opacity: 1; transition: all 0.2s ease 0s;">{{ text }}</div>
      <div class="button" style="opacity: 1; transition: all 0.2s ease 0s;">
          阅览文章
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/arrowbblakc.png">
      </div>
    </div>
    </a>
  </div>
</template>
<script>
export default {
  name: 'DirectoryItem'
}
</script>
<script setup>
import { defineProps } from 'vue'
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