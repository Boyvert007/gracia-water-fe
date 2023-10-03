import { getStorage } from "./storage";

export const checkPermission = (module_alias, permission) => {
  const accessList = JSON.parse(getStorage("access_list"));
  return (
    accessList[module_alias] &&
    accessList[module_alias].includes(module_alias + "_" + permission)
  );
};

export const checkPermissionDisplay = (module_alias, permission) => {
  const accessList = JSON.parse(getStorage("access_list"));
  return accessList[module_alias] &&
    accessList[module_alias].includes(module_alias + "_" + permission)
    ? "inline-flex"
    : "none";
};
