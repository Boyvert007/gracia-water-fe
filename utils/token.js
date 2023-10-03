export const getToken = (tokenName) => {
  return localStorage.getItem(tokenName);
};

export const setToken = (tokenName, tokenValue) => {
  localStorage.setItem(tokenName, tokenValue);
};

export const deleteToken = (tokenName) => {
  localStorage.removeItem(tokenName);
};
