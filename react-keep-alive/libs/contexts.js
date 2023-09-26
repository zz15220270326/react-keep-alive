import { createContext } from 'react';

/** KeepAlive 的 Context */
export const KeepAliveContext = createContext({
  setKeepAliveMap: ({ type, payload }) => null,
  renderKeepAliveComponent: ({ aliveId, wrapRef }) => null,
  getStatus: ({ aliveId }) => '',
  getScopeMap: () => ({}),
});
