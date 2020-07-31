<template>
  <main>
    <section>
      <tree-view :data="data"></tree-view>
    </section>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import TreeView from "@/Basic/Index.vue";

@Component({
  name: "App",
  components: {
    TreeView,
  },
})
export default class App extends Vue {
  data = [
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
}
</script>

<style lang="less" scoped>
main {
  position: relative;
}

section {
  min-width: 250px;
  height: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
}

/deep/ ul,
/deep/ li {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>