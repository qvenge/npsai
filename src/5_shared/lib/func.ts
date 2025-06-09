export function callWithLimit<R extends any>(
  func: Function,
  args: any[],
  limit: number = Infinity
): Promise<PromiseSettledResult<Awaited<R>>[]> {
  return new Promise((resolve) => {
    const results: any[] = [];
    let pointer = 0;
  
    for (; pointer < args.length && pointer < limit; ++pointer) {
      callAndInsert(pointer);
    }

    function callAndInsert(index: number) {
      results[index] = func.apply(null, Array.isArray(args[index]) ? args[index] : [args[index]])
        .finally(() => {
          pointer++;
      
          if (pointer < args.length) {
            callAndInsert(pointer);
          } else {
            resolve(Promise.allSettled<R[]>(results));
          }
        })
    }
  });
}