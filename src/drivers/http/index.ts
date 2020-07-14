import { getEnv } from "../../get_env";
import { createApi } from "./api";

export const create = () => {
  const port = getEnv("PORT");
  const api = createApi({ port });

  return api;
};