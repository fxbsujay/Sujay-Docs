---
layout: doc
aside: false
---

<script setup>
import { defineClientComponent } from 'vitepress';
const BubblyButton = defineClientComponent(() => {
  return import('../support/component/button/BubblyButton.vue')
});
import BasicsAnimationButtons from '../support/component/button/BasicsAnimationButtons.vue';
import HoverContinueButton from '../support/component/button/HoverContinueButton.vue';
const HoverEffectsButtons = defineClientComponent(() => {
  return import('../support/component/button/HoverEffectsButtons.vue')
});
import RubberButton from '../support/component/button/RubberButton.vue';
import MenuButton from '../support/component/button/MenuButton.vue';
import CyberpunkButton from '../support/component/button/CyberpunkButton.vue';
</script>
<div class="component-box">
<CyberpunkButton class="component-item"/>
<MenuButton class="component-item"/>
<HoverContinueButton class="component-item" />
<BubblyButton class="component-item"/>
<RubberButton class="component-item"/>
<HoverEffectsButtons class="component-item"/>
</div>

<BasicsAnimationButtons />
