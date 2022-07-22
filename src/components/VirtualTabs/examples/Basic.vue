<script lang="ts" setup>
import { ref } from 'vue'
// import chroma from 'chroma-js'
import VirtualTabs from '../VirtualTabs.vue'

// const tabIndex = ref(500)
// const tabs = new Array(1000).fill(null).map((_, i) => ({ label: `tab ${i}`, value: `tab ${i}` }))
// const tabsColor = tabs.map(() => chroma.random().name())

const tabIndex = ref(500)
const tabs = new Array(1000).fill(null).map((_, i) => ({ label: `tab ${i}`, value: `tab ${i}` }))
const tabIndex2 = ref(500)
const tabs2 = new Array(1000).fill(null).map((_, i) => ({ label: `tab ${i}`, value: `tab ${i}` }))
const tabIndex3 = ref(500)
const tabs3 = new Array(1000).fill(null).map((_, i) => ({ label: `tab ${i}`, value: `tab ${i}` }))
</script>

<template>
  <VirtualTabs
    v-slot="{ index }"
    v-model="tabIndex"
    :tabs="tabs"
    is-virtual
  >
    <div style="height: 100px">
      This is {{ tabs[index].value }}
    </div>
  </VirtualTabs>
  <VirtualTabs
    v-slot="{ index }"
    v-model="tabIndex2"
    :tabs="tabs2"
    is-virtual
    type="bookmarks"
  >
    <div style="height: 100px">
      This is {{ tabs[index].value }}
    </div>
  </VirtualTabs>
  <VirtualTabs
    v-slot="{ index }"
    v-model="tabIndex3"
    :tabs="tabs3"
    is-virtual
    type="pills"
  >
    <div style="height: 100px">
      This is {{ tabs[index].value }}
    </div>
  </VirtualTabs>
</template>
