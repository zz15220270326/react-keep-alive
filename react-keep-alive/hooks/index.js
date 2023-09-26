import { useContext, useEffect, useRef } from 'react';
import { KeepAliveContext } from '../libs/contexts';
import { OperateAliveComponentMapTypes } from '../libs/configs';

/** @type {object} KeepAliveContext 中的值 **/
let scopeCtx = {};

/**
 * 异步执行回调函数
 * @param {function} callback 回调函数
 * @param {number | undefined} delay 延迟执行的时间
 */
function useAsyncCallback(callback, delay) {
  /** 生命周期钩子函数 */
  const liveCycleHooks = {
    init() {},
    before() {},
    after() {}
  };

  const _callback = typeof callback === 'function' 
                  ? callback
                  : (() => null);
  const _delay = typeof delay === 'number' && delay > 300
               ? delay
               : 300;
  let timer = null;
  
  liveCycleHooks.init({
    callback: _callback,
    delay: _delay,
  });

  timer = setTimeout(() => {
    liveCycleHooks.before({
      callback: _callback,
      delay: _delay,
    });

    const result = _callback();

    liveCycleHooks.after({
      result,
      callback: _callback,
      delay: _delay,
    });

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }, _delay);

  return liveCycleHooks;
}

/**
 * 用来初始化scope的值
 */
function useInitScopeContext() {
  const initProps = useContext(KeepAliveContext);
  scopeCtx = initProps;
}

/**
 * useAliveScope
 * @description 用来获取当前 scope 值和设置 scope 值方法的 hook
 * @return {[object, ({ activeId: string; nodes: HTMLElement }) => void]}
 */
function useAliveScope() {
  const { getScopeMap, setKeepAliveMap } = scopeCtx;

  const scopeValue = getScopeMap();

  const setScopeValue = ({ aliveId, nodes }) => {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          if ([undefined, null].includes(aliveId)) {
            throw new Error('"aliveId" is required !');
          }
          const oldValue = getScopeMap();
          // sub checks
          setKeepAliveMap({
            type: OperateAliveComponentMapTypes.UpdateCache,
            payload: {
              aliveId,
              nodes,
              status: OperateAliveComponentMapTypes.UpdateCache
            }
          });
          const newValue = getScopeMap();
          resolve({ newValue, oldValue });
        }, 0);
      } catch (e) {
        reject(e);
      }
    });
  }

  return {
    scopeValue,
    setScopeValue
  };
}

/**
 * 获取当前 scope 的activeId (OK)
 */
function useAliveId() {
  const { getAliveId } = scopeCtx;
  const aliveId = getAliveId();

  return aliveId;
}

/** 使用 useScopeStatus 可以对 进入 / 离开 scope 进行操作 (NO OK) */
function useScopeStatus() {
  const mountCallbacks = useRef([]);
  const updateCallbacks = useRef([]);
  const removeCallbacks = useRef([]);

  const aliveId = useAliveId();
  const { scopeValue } = useAliveScope();

  const onMounted = (callback) => {
    if (typeof callback === 'function') {
      mountCallbacks.current.push(callback);
    }
  }

  const onActived = (callback) => {
    if (typeof callback === 'function') {
      updateCallbacks.current.push(callback);
    }
  }

  const onUnmount = (callback) => {
    if (typeof callback === 'function') {
      removeCallbacks.current.push(callback);
    }
  }

  useEffect(() => {
    const currentScope = scopeValue[aliveId];

    if (!currentScope) {
      return;
    }
    const { status } = currentScope;

    switch (status) {
      case OperateAliveComponentMapTypes.AddCache:
        // console.log('add scope');
        mountCallbacks.current.forEach(fn => fn());
        break;
      case OperateAliveComponentMapTypes.UpdateCache:
        // console.log('update scope');
        updateCallbacks.current.forEach(fn => fn());
        break;
      case OperateAliveComponentMapTypes.RemoveCache:
        // console.log('remove cache');
        removeCallbacks.current.forEach(fn => fn());
        break;
      default:
        break;
    }
  }, [scopeValue, aliveId, mountCallbacks, updateCallbacks, removeCallbacks]);

  return {
    onMounted,
    onActived,
    onUnmount
  };
}

/**
 * 清除当前的scope作用域 (TO TEST)
 * @param { number | { aliveId: string; [key: string]: any } | undefined } options 配置项
 */
function useClearScope(options) {
  const { setKeepAliveMap } = useContext(KeepAliveContext);
  
  const removeScopeById = ({ aliveId }) => {
    setKeepAliveMap({
      type: OperateAliveComponentMapTypes.RemoveCache,
      payload: {
        aliveId
      },
    });
  }

  const clearAllScope = () => {
    setKeepAliveMap({
      type: OperateAliveComponentMapTypes.ClearCache
    });
  }

  if (typeof options === 'number') {
    const aliveId = options;
    return () => {
      removeScopeById({ aliveId });
    };
  }
  if (typeof options === 'object' && options !== null) {
    return () => {
      removeScopeById(options);
    };
  }

  return clearAllScope;
}

export {
  useInitScopeContext,
  useAsyncCallback,
  useAliveScope,
  useClearScope,
  useAliveId,
  useScopeStatus,
};