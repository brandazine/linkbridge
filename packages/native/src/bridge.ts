type Procedure = (...args: any[]) => any;

type ProceduresObject<T extends Record<string, Procedure>> = {
  [K in keyof T]: (
    ...args: Parameters<T[K]>
  ) => Promise<Awaited<ReturnType<T[K]>>>;
};

export type Bridge = <T extends Record<string, Procedure>>(
  procedures: T
) => ProceduresObject<T>;

export const bridge: Bridge = (procedures) => {
  console.log(procedures);
  return procedures;
};