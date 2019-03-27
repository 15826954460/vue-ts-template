<template>
  <div class="hello">
    <p>
      <button @click="close">修改状态</button>
      <span>{{ state }}</span>
    </p>

    <button @click="addToCount">addToCount</button>
    {{count}}
    <button @click="resetCount">resetCount</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

@Component // 装饰器语法参照 https://www.npmjs.com/package/vue-property-decorator
export default class HelloWorld extends Vue {
  @Prop() public state: any; // 子组件接收过来的值
  private count: number;
  constructor() {
    super();
    this.count = 0;
  }
  // 关闭弹框 并传给父组件
  public close(): void {
    this.$emit("stateValue", !this.state);
  }

  @Emit("add")
  public addToCount() {
    this.count += 1;
  }

  @Emit("reset")
  public resetCount() {
    this.count = 0;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
