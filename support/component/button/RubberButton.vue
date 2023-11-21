
<template>
  <div>
    <button class="button">
      <svg class="button__shape" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path class="button__path" d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0 z"/>
      </svg>
      <span class="button__content">
    按住我
  </span>
    </button>
  </div>
</template>
<style scoped>

.button {
  width: 130px;
  height: 50px;
  appearance: none;
  background: transparent;
  border: 0;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-weight: 500;
  line-height: 1;
  padding: 1em 1.5em;
  position: relative;
  transition: filter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  user-select: none;
}

.button:hover {
  filter: brightness(1.1);
}

.button:active {
  filter: brightness(0.9);
}

.button__content {
  display: block;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.button:hover .button__content {
  transform: scale(1.05);
}

.button:active .button__content {
  transform: scale(0.95);
}

.button__shape {
  fill: #950cde;
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  overflow: visible;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@supports not (d: path('')) {
  .button:hover .button__shape {
    transform: scale(1.05);
  }

  .button:active .button__shape {
    transform: scale(0.95);
  }
}

.button__path {
  transition: d 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.button:hover .button__path {
  d: path("M0,0 C0,-5 100,-5 100,0 C105,0 105,100 100,100 C100,105 0,105 0,100 C-5,100 -5,0 0,0 z");
}

.button:active .button__path {
  d: path("M0,0 C30,10 70,10 100,0 C95,30 95,70 100,100 C70,90 30,90 0,100 C5,70 5,30 0,0 z");
}
</style>
<script setup lang="ts">
</script>