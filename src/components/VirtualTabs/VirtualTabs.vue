<script setup lang="ts">
import type { PropType } from 'vue'
import { nextTick, ref, useSlots, watch } from 'vue'
import { isNumber } from 'is-what'
import { Virtual } from 'swiper'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import Grid from 'vue-virtual-scroll-grid'
import { useVModel } from '@vueuse/core'
import scrollIntoView from 'scroll-into-view'
import type { TabInfo, TabType } from './VirtualTabs'
import VirtualTab from './VirtualTab.vue'

const props = defineProps({
  modelValue: { type: Number as PropType<number>, required: true },
  type: { type: String as PropType<TabType>, default: 'underline' },
  tabs: { type: Array as PropType<TabInfo[]>, default: () => [] },
  isVirtual: { type: Boolean as PropType<boolean>, default: undefined },
  swipeable: { type: Boolean as PropType<boolean>, default: true },
  hideTabLabels: { type: Boolean as PropType<boolean>, default: undefined },
  autoHeight: { type: Boolean as PropType<boolean>, default: undefined },
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void
}>()

const slots = useSlots()

const tabsEl = ref<HTMLDivElement>()
const swiper = ref<SwiperInstance>()

const tabIndex = useVModel(props, 'modelValue', emit)

watch(tabIndex, (newValue, oldValue) => {
  nextTick(() => {
    if (!isNumber(newValue) || newValue < 0)
      return
    swiper.value?.slideTo(newValue)
  })
  scrollTo(newValue, oldValue)
},
)

watch(
  () => props.swipeable,
  (val) => {
    if (swiper.value)
      swiper.value.allowTouchMove = val
  },
)

function pageProvider(pageNumber: number, pageSize: number): Promise<TabInfo[]> {
  const tabs = props.tabs.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
  return Promise.resolve(tabs)
}

function clickTab(index: number) {
  tabIndex.value = index
}

function onSlideChange(e: SwiperInstance) {
  tabIndex.value = e.activeIndex
}

function setSwiper(e: SwiperInstance) {
  swiper.value = e
}

function resize(e: SwiperInstance) {
  nextTick(() => {
    e.virtual.update(true)
  })
}

const scrollToIndex = ref<number | undefined>(tabIndex.value)
const scrollBehavior = ref<'auto' | 'smooth'>('auto')

async function scrollTo(newValue: number | undefined, oldValue?: number) {
  await timeout()
  const { containerRect, itemEl, itemRect } = getElementsScrollTo(newValue)
  if (!isNumber(newValue))
    return
  if (containerRect && itemEl && itemRect && newValue !== -1) {
    // If the element exist in DOM, using scrollIntoView
    if (itemRect.left < containerRect.left)
      scrollIntoView(itemEl, { time: 300, align: { left: 0 } })
    else if (itemRect.right >= containerRect.right)
      scrollIntoView(itemEl, { time: 300, align: { left: 1 } })
  }
  else {
    // Else use smoothly scroll provide by vue-virtual-scroll-grid
    scrollBehavior.value = 'smooth'
    setScrollToIndex(newValue)
    await timeout(300)
    scrollBehavior.value = 'auto'
  }
}

async function setScrollToIndex(index?: number) {
  if (scrollToIndex.value === index) {
    scrollToIndex.value = (index || 0) + 1
    await nextTick()
    scrollToIndex.value = (scrollToIndex.value || 0) - 1
  }
  else {
    scrollToIndex.value = index
  }
}

function getElementsScrollTo(index: number | undefined) {
  if (!isNumber(index))
    return {}
  const containerEl = tabsEl.value
  const containerRect = containerEl?.getBoundingClientRect()
  const itemEl: HTMLElement | null | undefined = containerEl?.querySelector(
      `[data-index="${index}"]`,
  )
  const itemRect = itemEl?.getBoundingClientRect()

  return {
    containerRect,
    itemEl,
    itemRect,
  }
}

function timeout(ms = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
</script>

<template>
  <div
    ref="tabsEl"
    class="tabs"
  >
    <Grid
      :length="tabs.length"
      :page-size="40"
      :page-provider="pageProvider"
      :scroll-to="scrollToIndex"
      :scroll-behavior="scrollBehavior"
      class="grid"
    >
      <template #probe>
        <div class="item">
          Probe
        </div>
      </template>

      <!-- When the item is not loaded, a placeholder is rendered -->
      <template #placeholder="{ style }">
        <VirtualTab
          :style="style"
          :type="type"
        >
          Loading...
        </VirtualTab>
      </template>

      <!-- Render a loaded item -->
      <template #default="{ item, style, index }">
        <VirtualTab
          :style="style"
          :current-index="tabIndex"
          :type="type"
          :is-active="tabIndex === index"
          :data-index="index"
          @click="() => clickTab(index)"
        >
          <slot
            name="tab"
            v-bind="{ tab: item, index }"
          >
            <div>{{ item.label }}</div>
          </slot>
        </VirtualTab>
      </template>
    </Grid>
  </div>

  <div
    v-if="slots.default"
    class="tab-panels"
  >
    <Swiper
      :modules="[Virtual]"
      :initial-slide="tabIndex"
      :threshold="20"
      virtual
      :allow-touch-move="swipeable"
      :auto-height="autoHeight"
      @swiper="setSwiper"
      @slide-change="onSlideChange"
      @resize="resize"
    >
      <SwiperSlide
        v-for="(tab, index) in tabs"
        :key="index"
        :virtual-index="index"
      >
        <slot v-bind="{ tab, index }" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style scoped>
.tabs {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  z-index: 2;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}
.tabs::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}
.grid {
  display: grid;
  place-items: start stretch;
  box-sizing: content-box;
  grid-auto-flow: column;
  grid-template-rows: 1fr;
}
.tab-panels {
  flex: 1;
  overflow: auto;
}
:deep(.swiper) {
  height: 100%;
}
:deep(.swiper-slide) {
  overflow: auto;
}
</style>
