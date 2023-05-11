---
sidebar: false
layout: page
---

<script setup>
import Directory from '../support/directory.vue'
import { useData } from 'vitepress'
import { useSidebar } from 'vitepress/dist/client/theme-default/composables/sidebar'

const page = import('./jdk_support.md')

const data = useData()
page.then( res => {
console.log(res)
console.log(data.lang.value)
console.log(new Date(res.__pageData.lastUpdated).toLocaleString(data.lang.value))
})

const { sidebar } = useSidebar()

console.log(sidebar)

</script>


文章目录 :tada:

<Directory :sidebarGroups="sidebar" />


