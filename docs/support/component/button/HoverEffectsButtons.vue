<script setup lang="ts">
import { nextTick } from 'vue'
nextTick(() => {
  const buttons = document.querySelectorAll('.effects-button')
  buttons.forEach(button => {
    button.innerHTML = '<div><span>' + button.textContent.trim().split('').join('</span><span>') + '</span></div>'
  })
})
</script>

<template>
  <div class="effects-button">Button</div>
</template>

<style>

.effects-button {
  display: inline-block;
  width: 120px;
  margin-right: 24px;
  margin-top: 20px;
  padding: 16px 32px;
  font-weight: 500;
  line-height: 16px;
  border-radius: 24px;
  outline: none;
  text-decoration: none;
  font-size: 16px;
  letter-spacing: 1px;
  background: #275efe;
  color: #fff;
  box-shadow: 0 2px 8px -1px rgba(39, 94, 254, .32);
  transition: transform 0.44s ease, box-shadow 0.44s ease;
}

.effects-button div {
  display: flex;
  overflow: hidden;
  text-shadow: 0 16px 0 #fff;
}
.effects-button div span {
  display: block;
  backface-visibility: hidden;
  font-style: normal;
  transition: transform 0.44s ease;
}

.effects-button div span:nth-child(1) {
  transition-delay: 0.05s;
}
.effects-button div span:nth-child(2) {
  transition-delay: 0.1s;
}
.effects-button div span:nth-child(3) {
  transition-delay: 0.15s;
}
.effects-button div span:nth-child(4) {
  transition-delay: 0.2s;
}
.effects-button div span:nth-child(5) {
  transition-delay: 0.25s;
}
.effects-button div span:nth-child(6) {
  transition-delay: 0.3s;
}
.effects-button div span:nth-child(7) {
  transition-delay: 0.35s;
}
.effects-button div span:nth-child(8) {
  transition-delay: 0.4s;
}
.effects-button div span:nth-child(9) {
  transition-delay: 0.45s;
}
.effects-button div span:nth-child(10) {
  transition-delay: 0.5s;
}
.effects-button div span:nth-child(11) {
  transition-delay: 0.55s;
}

.effects-button:hover {
  transform: translateY(-4px) translateZ(0);
  box-shadow: 0 4px 20px -2px rgba(39, 94, 254, .5);
}

.effects-button:hover span {
  transition: transform 0.44s ease;
  transform: translateY(calc(16px * -1)) translateZ(0);
}
</style>