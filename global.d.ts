interface Dictionary<T = unknown> {
  [key: string]: T;
}

type ChainFns<Input, T extends any[]> =
  T extends [infer Next, ...infer Rest]
    ? [(input: Input) => Next, ...ChainFns<Next, Rest>]
    : [];