<script lang="ts" setup>
import { ref } from 'vue'
import chroma from 'chroma-js'
import VirtualTabs from '../VirtualTabs.vue'

const tabIndex = ref(500)
const tabs = new Array(1000).fill(null).map((_, i) => ({ label: `tab ${i}`, value: `tab ${i}` }))
const tabsColor = tabs.map(() => chroma.random().name())
</script>

<template>
  <VirtualTabs
    v-slot="{ index }"
    v-model="tabIndex"
    :tabs="tabs"
    is-virtual
  >
    <div
      style="min-height: 300px"
      :style="{ backgroundColor: tabsColor[index] }"
    >
      This is {{ tabs[index].value }}
    </div>
  </VirtualTabs>
  <pre>{{ tabIndex }}</pre>
</template>
