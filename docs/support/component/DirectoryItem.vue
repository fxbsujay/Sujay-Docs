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
    <div class="image">
      <img draggable="false" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/nike.png" class="out">
      <div class="overlay" style="opacity: 1; transition: all 0.2s ease 0s;"></div>
      <div class="cats" style="opacity: 1; transition: all 0.2s ease 0s;">5/12/2023, 12:24:35 AM</div>
      <div class="title" style="opacity: 1; transition: all 0.2s ease 0s;">JDK 17 新特性一览</div>
      <div class="button" style="opacity: 1; transition: all 0.2s ease 0s;">
        <a href="https://www.antdv.com/components/config-provider-cn">
          阅览文章
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/arrowbblakc.png">
        </a>
      </div>
    </div>
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
  }
})



</script>

<style scoped>

</style>