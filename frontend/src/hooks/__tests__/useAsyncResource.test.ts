import { renderHook, waitFor, act } from '@testing-library/react';
import { useAsyncResource } from '../useAsyncResource';

const createDeferred = <T,>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
};

describe('useAsyncResource', () => {
  it('keeps the loading state until the loader resolves', async () => {
    const deferred = createDeferred<string>();
    const loader = jest.fn(() => deferred.promise);

    const { result } = renderHook(() => useAsyncResource(loader));

    await waitFor(() => expect(result.current.loading).toBe(true));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await act(async () => {
      deferred.resolve('loaded value');
      await deferred.promise;
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBe('loaded value');
    expect(result.current.error).toBeNull();
  });

  it('exposes the success state when the loader resolves immediately', async () => {
    const loader = jest.fn(async () => ({ id: 1, name: 'Club Norte' }));

    const { result } = renderHook(() => useAsyncResource(loader));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ id: 1, name: 'Club Norte' });
    expect(result.current.error).toBeNull();
  });

  it('maps loader errors into the error state', async () => {
    const loader = jest.fn(async () => {
      throw new Error('No se pudo cargar');
    });

    const { result } = renderHook(() => useAsyncResource(loader));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('No se pudo cargar');
  });

  it('resets the state when disabled', async () => {
    const loader = jest.fn(async () => 'unused');

    const { result, rerender } = renderHook(
      ({ enabled }) => useAsyncResource(loader, enabled),
      { initialProps: { enabled: true } },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    rerender({ enabled: false });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
