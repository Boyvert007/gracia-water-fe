export const getStorage = (key) => {
    return localStorage.getItem(key);
  };
  
  export const setStorage = (key, val) => {
    localStorage.setItem(key, val);
  };
  
  export const deleteStorage = (key) => {
    localStorage.removeItem(key);
  };

  export const clearStorage = () => {
    localStorage.clear();
  };
  