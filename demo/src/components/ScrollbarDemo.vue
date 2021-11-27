<template>
  <div class="demo">
    <div class="refs" ref="scrollbarRef"></div>
    <div class="description">
      <h2>Scrollbar</h2>
      <div class="controls">
        <div>🚧 施工中……</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ScrollbarDemo",

  setup() {
    const scrollbarRef = ref<HTMLElement>();

    return {
      scrollbarRef,
    };
  },
});
</script>

<style scoped></style>
