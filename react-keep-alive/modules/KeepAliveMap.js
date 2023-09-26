import { OperateAliveComponentMapTypes } from '../libs/configs';

class KeepAliveMap {
  constructor() {
    this.keepAliveMap = {};
  }

  set({ type, payload }, callback) {
    const { aliveId, reactElement, nodes } = payload;
    const { keepAliveMap } = this;

    switch(type) {
      case OperateAliveComponentMapTypes.AddCache:
        this.keepAliveMap = {
          ...keepAliveMap,
          [aliveId]: {
            aliveId,
            reactElement,
            nodes: null,
            status: type
          },
        };
        break;
      case OperateAliveComponentMapTypes.UpdateCache:
        keepAliveMap[aliveId] = {
          ...keepAliveMap[aliveId],
          nodes,
          status: type,
        };
        break;
      default:
        break;
    }

    typeof callback === 'function' && callback({
      keepAliveMap: this.keepAliveMap
    });
  }

  clear() {
    this.keepAliveMap = {};
  }
}

export default KeepAliveMap;
