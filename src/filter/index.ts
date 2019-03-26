// 首字母转大写
const capitalize = (value: any) => {
  if (!value) {
    return "";
  }
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
};
export { capitalize };
