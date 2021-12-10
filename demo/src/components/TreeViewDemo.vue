<template>
  <div class="demo">
    <div class="refs" ref="treeviewRef"></div>
    <div class="description">
      <h2>Tree View</h2>
      <div class="controls">
        <button @click="onClose()">折叠</button>
        <button @click="onCloseAll()">递归折叠</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { TreeView } from "../../../src";

export default defineComponent({
  name: "TreeViewDemo",

  setup() {
    const treeviewRef = ref<HTMLElement>();
    const TreeData = ref<any>();
    const TreeViewInstance = ref<TreeView>();

    const onClick = (event: Event) => {
      console.info(event);
    };

    const onContextMenu = (event: Event) => {
      console.info(event);
    };

    const onClose = () => {
      TreeViewInstance.value?.toggleCollpaseAll(false);
    };

    const onCloseAll = () => {
      TreeViewInstance.value?.toggleCollpaseAll(true);
    };

    onMounted(async () => {
      TreeData.value = await (await fetch(`${import.meta.env.BASE_URL}data/tree-level-1.json`)).json();

      TreeViewInstance.value = new TreeView(
        treeviewRef.value!,
        {
          fetchHandler: async () => {
            return await (await fetch(`${import.meta.env.BASE_URL}data/tree-level-1.json`)).json();
          },
        },
        TreeData.value
      );

      TreeViewInstance.value.on("click", onClick);
      TreeViewInstance.value.on("contextmenu", onContextMenu);
      TreeViewInstance.value.invoke();

      (window as any).TreeViewInstance = TreeViewInstance.value;
    });

    onUnmounted(() => {
      TreeViewInstance.value?.dispose();
    });

    return {
      treeviewRef,
      onClose,
      onCloseAll,
    };
  },
});
</script>

<style scoped></style>
