import {onMounted, onUnmounted} from "vue";

export function onViewportSizeChange(onUpdateCallback: () => void) {
  const onResize = () => {
    onUpdateCallback?.();
  }

  onMounted(() => {
    window.addEventListener('resize', onResize)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
  })
}
