import { Result } from "types";

export type ActionArgsSchema<
  TAction extends (args: any) => Result<any, any>
> = TAction extends (args: infer TArgs) => Result<any, any>
  ? (keyof TArgs)[]
  : never;

export type Api = { [k: string]: (args: any) => Result<any, any> };

export type ActionsSchema<TApi extends Api> = {
  [K in keyof TApi]: {
    args: ActionArgsSchema<TApi[K]>;
  };
};

export type ModuleSchema<TApi extends Api> = {
  module: string;
  actions: ActionsSchema<TApi>;
};

export type ActionSchema = {
  args: string[];
};

export type Close = () => Promise<void>;

export type AddModule = <TApi extends Api>(
  moduleSchema: ModuleSchema<TApi>,
  api: TApi
) => void;

export type HttpApi = {
  close: Close;
  addModule: AddModule;
};
