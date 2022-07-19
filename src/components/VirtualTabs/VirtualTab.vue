<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, nextTick, ref, watch } from 'vue'
import type { TabType } from './VirtualTabs'

const props = defineProps({
  currentIndex: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as PropType<TabType>,
    default: 'underline',
  },
})

const root = ref<null | HTMLElement>(null)
const tabsEl = computed(() => {
  if (root.value)
    return root.value.closest('tabs')
  else
    return null
})

const animateStyle: any = ref({})

watch(
  () => props.type,
  () => {
    if (props.isActive)
      animateStyle.value = {}
  },
)

watch([() => props.currentIndex, () => props.isActive], async (newValues, oldValues) => {
  await nextTick()
  await nextTick()
  const [newCurrentIndex, newIsActive] = newValues
  const [oldCurrentIndex, oldIsActive] = oldValues

  const isActiveFromFalseToTrue = newIsActive && !oldIsActive
  const isActiveFromTrueToFalse = !newIsActive && oldIsActive
  if (isActiveFromFalseToTrue) {
    const oldIndicatorRect = getRectByIndex(oldCurrentIndex, '.tab-indicator')
    const newIndicatorRect = getRectByIndex(newCurrentIndex, '.tab-indicator')
    const oldWidth = `${oldIndicatorRect?.width}px`
    const newWidth = `${newIndicatorRect?.width}px`

    if (oldIndicatorRect && newIndicatorRect) {
      const offsetX = oldIndicatorRect.x - newIndicatorRect.x
      animate(offsetX, oldWidth, newWidth)
    }
    else {
      const rootRect = tabsEl.value?.getBoundingClientRect() as DOMRect
      if (rootRect && newIndicatorRect) {
        if (newCurrentIndex > oldCurrentIndex) {
          const offsetX = rootRect.x - newIndicatorRect.x
          animate(offsetX, oldWidth, newWidth)
        }
        else {
          const offsetX = rootRect.right - newIndicatorRect.x
          animate(offsetX, oldWidth, newWidth)
        }
      }
    }
  }
  else if (isActiveFromTrueToFalse) {
    animateStyle.value = {}
  }
})

async function animate(offsetX: number, oldWidth: string, newWidth: string): Promise<void> {
  await nextTick()
  animateStyle.value = {
    transform: `translateX(${offsetX}px)`,
    width: oldWidth,
  }
  setTimeout(() => {
    animateStyle.value = {
      transitionProperty: 'transform, width',
      transitionDuration: '0.3s',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'translateX(0px)',
      width: newWidth,
    }
  })
}

function rootQuerySelectorByIndex(index: number, selector: string): null | HTMLElement {
  return (tabsEl.value as HTMLElement)?.querySelector(
    `[data-index="${index}"][data-active="true"] ${selector}`,
  )
}

function getRectByIndex(index: number, selector: string): undefined | DOMRect {
  return rootQuerySelectorByIndex(index, selector)?.getBoundingClientRect()
}
</script>

<template>
  <div
    ref="root"
    class="tab"
    :class="[{ 'tab--active': isActive }, `tab-${type}`]"
  >
    <div class="tab-content">
      <div
        class="tab-indicator"
        :style="animateStyle"
      />
      <div class="tab-label">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab {
  --tab-background: red;
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: inherit;
  min-height: 36px;
  padding: 0 16px;
  white-space: nowrap;
  font-size: 14px;
  line-height: 1.715em;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  transition-property: background-color, color;

  .tab-indicator {
    opacity: 0;
  }

  &.tab--active .tab-indicator {
    opacity: 1;
  }
}

.tab-content {
  position: relative;
  padding: 4px 0;
}

.tab-indicator {
  will-change: width, transform;
  z-index: 1;
}

.tab-label {
  position: relative;
  z-index: 2;
  // Make sure .tab-label is on top of .tab-indicator in iOS app
  transform: translateZ(0);
}

.tab-underline {
  .tab-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--tab-background);
  }

  &.tab--active {
    color: var(--tab-background);
  }
}

.tab-pills {
  .tab-indicator {
    position: absolute;
    bottom: 0.4em;
    right: -0.8em;
    left: -0.8em;
    height: 1.5em;
    border-radius: 100px;
    background: var(--tab-background);
  }

  &.tab--active {
    color: white;
  }
}

.tab-bookmarks {
  padding: 0;

  .tab-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 36px;
    padding: 0 16px;
  }

  .tab-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
    background: white;
  }
}
</style>
