export const serialize = (obj?: object | null) => {
  return JSON.parse(JSON.stringify(obj));
};
