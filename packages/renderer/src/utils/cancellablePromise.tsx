export type CancelPromise = ((reason?: Error) => void) | undefined;
export interface CancellableOperation<T> {
  cancel: CancelPromise;
  start: () => Promise<T>;
}

export const cancellablePromise = <T,>(promiseToCancel: Promise<T>): CancellableOperation<T> => {
  let cancel: CancelPromise;
  const start = (): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      cancel = reject;
      promiseToCancel
        .then(result => {
          cancel = undefined;
          resolve(result);
          return true;
        })
        .catch(reject);
    });
  return { start, cancel };
};
