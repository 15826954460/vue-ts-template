<template>
  <div class="home">
    <p>变量的引用：{{name}}</p>
    <p v-html="getName()"></p>

    <button @click="add">add</button>
    <p>变量：{{count}}</p>
    <p>计算属性：{{addCount}}</p>

    <div>自定义指令（首字母大写） ： {{modelData | capitalize}}</div>

    <button @click="vuexAdd">store add</button> 状态管理： {{stateTestCount}}
    <br>
    <button @click="vuexModuleAdd">module add</button> 模块的状态管理：{{someModuleNumber}}

    <p>组建通信：</p>
    <HelloWorld :state="state" @stateValue="stateValue"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { namespace, Action, Getter, Mutation, State } from "vuex-class";

const homeModule = namespace("home");
import { capitalize } from "@/filter/index";

@Component({
  components: { HelloWorld }, // 组建的引用
  filters: { capitalize } // 自定义指令
})

export default class Home extends Vue {
  /** vuex 的使用 参见 https://www.npmjs.com/package/vuex-class */
  @State("testCount") public stateTestCount: any;
  @Action("ac_add") public actionAdd: any;
  @homeModule.State("number") public someModuleNumber: any;
  @homeModule.Action("ac_addNumber") public someModuleAddNumber: any;

  // 私有属性必须放在私有变量上面
  public state: boolean = false;

  // 私有属性类型声明
  private name: string;
  private count: number;
  private modelData: string;
  constructor() {
    super();
    this.name = "typescript";
    this.count = 666;
    this.modelData = "filter.js test";
  }
  // 生命周期钩子函数的使用
  public created(): void {
    console.log("created");
  }

  public mounted(): void {
    console.log(process.env.BASE_URL);
    console.log(this.stateTestCount);
  }

  // 定义方法
  public getName() {
    return this.name + ": v_html";
  }
  public add(): void {
    this.count += 1;
  }

  public stateValue(value: boolean): void {
    this.state = value;
  }

  public welcome(): void {
    console.log("welcome to emit");
  }

  public vuexAdd(): void {
    this.actionAdd();
  }

  public vuexModuleAdd(): void {
    this.someModuleAddNumber();
  }

  // watch 监听器
  @Watch("count", { immediate: true, deep: true })
  public onChildChanged(val: string, oldVal: string) {
    console.log("watch new count${val}");
  }

  // 计算属性
  public get addCount() {
    return this.count * 10;
  }
}
</script>
<style>
.home {
  border: 1px solid red;
}
</style>

