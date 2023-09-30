const initVmCode = `
const _stringify = (data, objects) => {
  if (!objects) {
    objects = {};
  }
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "function" || value instanceof Function) {
      data[key] = value.toString();
    }
    for (const [objectKey, objectValue] of Object.entries(objects)){
      if (Object.is(objectValue, value)) {
        data[key] = \`[circular \${objectKey}]\`;
        delete objects[objectKey];
        break;
      }
    }
    try {
      JSON.stringify(value);
    } catch (_error) {
      objects[key] = value;
      _stringify(value, objects);
    }
  }
  return JSON.stringify(data, null, 2)
};

const end = (data) => postMessage(_stringify(data));
`.replaceAll("\n", "")

export default initVmCode
