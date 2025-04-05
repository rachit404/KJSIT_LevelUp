let response = "";

export const setResponse = (res) => {
  response = res;
};

export const getResponse = () => {
  return response;
};

export const resetResponse = () => {
  response = "";
};
