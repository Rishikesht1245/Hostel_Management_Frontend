// function to set api header while making api calls

import { getToken } from "./localStorage";

export const setApiHeader = () => {
  return { headers: { Authorization: `Bearer ${getToken()}` } };
};
