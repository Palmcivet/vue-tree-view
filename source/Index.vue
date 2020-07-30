<template>
  <ul>
    <tree-item
      v-for="(child, index) in treeData"
      :key="index"
      :itemData="child"
      :deepth="deepth + 1"
    ></tree-item>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import TreeItem, { ITreeItem } from "./TreeItem.vue";

@Component({
  name: "TreeView",
  components: {
    TreeItem,
  },
})
export default class TreeView extends Vue {
  @Prop({
    type: Array,
    // required: true,
    default: function () {
      return [
        {
          name: "child 1",
          children: [
            {
              name: "child 11",
              children: [{ name: "hello.md" }, { name: "wat.md" }],
            },
            {
              name: "child 22",
              children: [
                {
                  name: "child 11",
                  children: [{ name: "hello.md" }],
                },
                {
                  name: "child 22",
                  children: [{ name: "hello" }, { name: "wat" }],
                },
              ],
            },
            { name: "hello" },
            { name: "wat" },
          ],
        },
        {
          name: "child 1",
          children: [
            {
              name: "child 11",
              children: [{ name: "hello.md" }],
            },
          ],
        },
        {
          name: "child 1",
          children: [
            {
              name: "child 11",
              children: [{ name: "hello.md" }],
            },
          ],
        },
        { name: "hello.md" },
        { name: "wat.md" },
      ];
    },
  })
  treeData!: Array<ITreeItem>;

  @Prop({
    type: Number,
    default: 0,
  })
  deepth!: number;
}
</script>

<style lang="less" scoped>
</style>
