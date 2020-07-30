<template>
  <main>
    <section>
      <tree-view></tree-view>
    </section>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import TreeView from "@/Index.vue";

@Component({
  name: "App",
  components: {
    TreeView,
  },
})
export default class App extends Vue {}
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
</style>