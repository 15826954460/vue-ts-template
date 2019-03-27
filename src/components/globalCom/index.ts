/** 一下为动态注册全局组件的js代码 */
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import Vue from "vue";

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  ".", // Look for files in the current directory
  true, // Do not look in subdirectories
  /[A-Za-z]+\.vue$/ // Only include "_base-" prefixed .vue files
);

// For each matching file name...
requireComponent.keys().forEach(fileName => {
  // Get the component config
  const componentConfig = requireComponent(fileName);
  // Get the PascalCase version of the component name
  const componentName = upperFirst(
    // remove extension name
    camelCase(fileName.replace(/\.\w+$/, ""))
  );
  // Globally register the component
  Vue.component(componentName, componentConfig.default || componentConfig);
});
