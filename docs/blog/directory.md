---
sidebar: false
layout: page
---

<script setup>
import { ref } from 'vue'
import Directory from '../support/directory.vue'
import { useData } from 'vitepress'
import { useSidebar } from 'vitepress/dist/client/theme-default/composables/sidebar'

const page = import('./jdk_support.md')

const data = useData()
page.then( res => {
console.log(new Date(res.__pageData.lastUpdated).toLocaleString(data.lang.value))
})

const { sidebar } = useSidebar()
const sidebarGroups = ref([...sidebar.value.map(item => [...item.items])])
console.log(sidebar.value.map(item => [...item.items.map(subItem => [...item.items])]))

</script>


文章目录 :tada:

<Directory :sidebarGroups="sidebarGroups" />



