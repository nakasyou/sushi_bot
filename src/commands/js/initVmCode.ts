const initVmCode = `
const end = (...data) => {
  console.log(...data);
  close();
};
`.replaceAll("\n", "")

export default initVmCode
