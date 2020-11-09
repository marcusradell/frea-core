import { ApiResult } from "../../types";

export type Severity = "info" | "error"

export type Log = (args:{mod:string,type:string, severity:Severity,traceId?:string,result:unknown,clientCid?:string,args:unknown}) => void

export type ActionArgsSchema<
  TAction extends (args: any, ctx: any) => ApiResult<any, any>
> = TAction extends (args: infer TArgs, ctx: any) => ApiResult<any, any>
  ? (keyof TArgs)[]
  : never;

export type ApiContext = {
  type: string;
  token: any;
  clientCid?: string;
  clientIp?: string;
};

export type Api = {
  [k: string]: (args: any, ctx: ApiContext) => ApiResult<any, any>;
};

export type ActionsSchema<TApi extends Api> = {
  [K in keyof TApi]: {
    args: ActionArgsSchema<TApi[K]>;
    public?: true;
  };
};

export type ModuleSchema<TApi extends Api> = {
  module: string;
  actions: ActionsSchema<TApi>;
};

export type ActionSchema = {
  args: string[];
};

export type Listen = () => Promise<void>;

export type Close = () => Promise<void>;

export type AddModule = <TApi extends Api>(
  moduleSchema: ModuleSchema<TApi>,
  api: TApi
) => void;

export type GetApi =()=> ModuleSchema<Api>[]

export type HttpMod = {
  listen: Listen;
  close: Close;
  addModule: AddModule;
  getApi:GetApi
};
