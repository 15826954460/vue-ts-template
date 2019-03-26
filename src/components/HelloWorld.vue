<template>
  <div class="hello">
    <h1>{{ state }}</h1>
    <button @click="close">修改</button>
    <br>
    <button @click="addToCount">addToCount</button>
    <p>{{count}}</p>
    <button @click="resetCount">resetCount</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

@Component
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
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
