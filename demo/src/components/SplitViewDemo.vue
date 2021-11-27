<template>
  <div class="demo">
    <div class="refs" ref="splitviewRef"></div>
    <div class="description">
      <h2>Split View</h2>
      <div class="controls">
        <div class="group">
          <label>
            插入位置：
            <input type="number" v-model="insertIndex" />
          </label>
          <label>
            最小宽度：
            <input type="number" v-model="minimumSize" />
          </label>
          <label>
            最大宽度：
            <input type="number" v-model="maximumSize" />
          </label>
          <label style="width: 100%">
            优先层级：
            <label>
              <input type="radio" v-model="priority" value="0" />
              0
            </label>
            <label>
              <input type="radio" v-model="priority" value="1" />
              1
            </label>
          </label>
          <button @click="onAddView()">添加视图</button>
        </div>
        <div class="group">
          <label>
            删除位置：
            <input type="number" v-model="deleteIndex" />
          </label>
          <button @click="onDelView()">删除视图</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, nextTick } from "vue";
import { SplitView } from "../../../src";

export default defineComponent({
  name: "SplitViewDemo",

  setup() {
    const selectColor = () => {
      const color = [
        "#F53F3F",
        "#F77234",
        "#FF7D00",
        "#F7BA1E",
        "#FADC19",
        "#9FDB1D",
        "#00B42A",
        "#14C9C9",
        "#3491FA",
        "#D91AD9",
        "#F5319D",
        "#FF6B3B",
        "#FFC100",
        "#9FB40F",
        "#DAD5B5",
        "#0E8E89",
        "#E19348",
        "#F383A2",
        "#247FEA",
        "#2BCB95",
        "#B1ABF4",
        "#1D9ED1",
        "#D64BC0",
        "#8CDAE5",
      ];
      const index = Math.floor(Math.random() * color.length);
      return color[index];
    };

    let index = 0;

    const splitviewRef = ref<HTMLElement>();
    const SplitViewInstance = ref<SplitView>();
    const insertIndex = ref(0);
    const deleteIndex = ref(0);
    const minimumSize = ref(200);
    const maximumSize = ref(400);
    const priority = ref(1);

    const onAddView = () => {
      const _minimumSize = minimumSize.value ?? 200;
      const _maximumSize = maximumSize.value;
      const _priority = priority.value;
      const element = document.createElement("div");

      element.style.backgroundColor = selectColor();
      element.innerHTML = `<div class="new-view">
<div>#${index}</div>
<div>${_minimumSize}~${_maximumSize}</div>
</div>`;
      SplitViewInstance.value?.addView(
        {
          element,
          initialSize: 200 + index * 10,
          minimumSize: _minimumSize,
          maximumSize: _maximumSize,
          priority: _priority,
        },
        insertIndex.value
      );
      index += 1;
      insertIndex.value = SplitViewInstance.value!.length;
      deleteIndex.value = SplitViewInstance.value!.length;
    };

    const onDelView = () => {
      SplitViewInstance.value?.removeView(deleteIndex.value);
    };

    onMounted(() => {
      nextTick(() => {
        SplitViewInstance.value = new SplitView(splitviewRef.value!);
        SplitViewInstance.value.invoke();

        onAddView();
        onAddView();

        (window as any).SplitViewInstance = SplitViewInstance.value;
      });
    });

    onUnmounted(() => {
      SplitViewInstance.value?.dispose();
    });

    return {
      splitviewRef,
      insertIndex,
      deleteIndex,
      minimumSize,
      maximumSize,
      priority,
      onAddView,
      onDelView,
    };
  },
});
</script>

<style scoped lang="less">
.demo {
  padding: 20px !important;
  flex-direction: column;
}

.refs {
  width: 100%;
  height: 70vh;
  background: #2c3e50;
}

.description {
  width: 100% !important;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .controls {
    width: 70%;
    height: 100%;
    margin-top: 0;
    display: flex;

    .group {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }

    .group + .group {
      margin-left: 20px;
    }

    label,
    button {
      margin-top: 6px;
    }
  }
}
</style>

<style>
.new-view {
  text-align: center;
  font-weight: bold;
  color: #2c3e50;
}
</style>
