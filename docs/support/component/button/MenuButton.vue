
<template>
  <div>
    <div class="list-container">
      <button class="more-button" aria-label="Menu Button">
        <div class="menu-icon-wrapper">
          <div class="menu-icon-line half first"></div>
          <div class="menu-icon-line"></div>
          <div class="menu-icon-line half last"></div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { nextTick } from 'vue'
nextTick(() => {
  document.querySelector('.more-button').addEventListener('click', function () {
    document.querySelector('.list-container').classList.toggle('active')
  })
})
</script>
<style scoped>
.list-container {
  position: relative;
}
.list-container.active .more-button {
  animation: onePulse 0.6s forwards linear;
}
.list-container.active .menu-icon-wrapper {
  transform: rotate(-45deg);
}
.list-container.active .menu-icon-line.first {
  transform: rotate(-90deg) translateX(1px);
}
.list-container.active .menu-icon-line.last {
  transform: rotate(-90deg) translateX(-1px);
}
.more-button {
  background-color: #5c67ff;
  box-shadow: 0px 0px 0px 4px rgba(92, 103, 255, 0.3);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease-in;
  padding: 15px;
  color: #fff;
  position: relative;
  z-index: 2;
}
.more-button:hover, .more-button:focus {
  box-shadow: 0px 0px 0px 8px rgba(92, 103, 255, 0.3);
  background-color: #4854ff;
}
.more-button:focus {
  outline: 0;
}
@keyframes onePulse {
  0% {
    box-shadow: 0px 0px 0px 0px rgba(92, 103, 255, 0.3);
  }
  50% {
    box-shadow: 0px 0px 0px 12px rgba(92, 103, 255, 0.1);
  }
  100% {
    box-shadow: 0px 0px 0px 4px rgba(92, 103, 255, 0.3);
  }
}
@keyframes fadeInItem {
  100% {
    transform: translatex(0px);
    opacity: 1;
  }
}
.menu-icon-wrapper {
  border-radius: 2px;
  width: 20px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  position: absolute;
  margin-top: -20%;
  transition: transform 330ms ease-out;
}
.menu-icon-line {
  background-color: #fff;
  border-radius: 2px;
  width: 100%;
  height: 2px;
}
.menu-icon-line.half {
  width: 50%;
}
.menu-icon-line.first {
  transition: transform 300ms cubic-bezier(0.52, -0.8, 0.52, 0.52);
  transform-origin: right;
}
.menu-icon-line.last {
  align-self: flex-end;
  transition: transform 300ms cubic-bezier(0.52, -0.8, 0.52, 0.52);
  transform-origin: left;
}

</style>