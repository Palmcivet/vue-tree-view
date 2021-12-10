<template>
  <div class="demo">
    <div class="refs" ref="listviewRef"></div>
    <div class="description">
      <h2>List View</h2>
      <div class="controls">
        <button @click="onAddData()">添加数据</button>
        <button @click="onDelData()">删除数据</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { ListView } from "../../../src";

export default defineComponent({
  name: "ListViewDemo",

  setup() {
    const listviewRef = ref<HTMLElement>();
    const ListData = ref<any>();
    const ListViewInstance = ref<ListView<string>>();

    let start = 0;

    const clickHandler = (event: any) => {
      console.info("click", event);
    };

    const onAddData = () => {
      start += 10;
      ListViewInstance.value?.insertData(ListData.value.slice(start, start + 10));
    };

    const onDelData = () => {
      ListViewInstance.value?.deleteData(start, 1);
    };

    onMounted(async () => {
      ListData.value = await (await fetch(`${import.meta.env.BASE_URL}data/list.json`)).json();

      ListViewInstance.value = new ListView<string>(listviewRef.value!, {
        itemHeight: 24,
        fixedSize: false,
        suppressible: true,
        createHandler: () => {
          const node = document.createElement("li");
          return node;
        },
        renderHandler: (node, data, index) => {
          node.title = data;
          node.innerText = data;
          node.dataset.index = `${index}`;
        },
      });

      ListViewInstance.value.on("click", clickHandler);

      ListViewInstance.value.invoke();
      ListViewInstance.value.updateData(ListData.value.slice(start, start + 20));

      (window as any).ListViewInstance = ListViewInstance.value;
    });

    onUnmounted(() => {
      ListViewInstance.value?.dispose();
    });

    return {
      listviewRef,
      onAddData,
      onDelData,
    };
  },
});
</script>

<style scoped></style>
