<template>
  <div class="feed-display">
    <a href="#">
      <span class="feed-title">
        Aa
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