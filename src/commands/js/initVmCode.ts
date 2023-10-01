const initVmCode = `
import { stringify } from "javascript-stringify";
const end = (data) => postMessage(stringify(data, null, 2));
`.replaceAll("\n", "")

export default initVmCode
