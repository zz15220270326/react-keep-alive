import React, { Component } from 'react';
import { render, createPortal } from 'react-dom';
import { OperateAliveComponentMapTypes } from '../libs/configs';
import { KeepAliveContext } from '../libs/contexts';

/*
  {
    aliveId: {
      aliveId - 用户提供的aliveId
      reactElement - 组件首次渲染时的 JSX.Element
      nodes - 用户第二次开始渲染的wrapRef 下面的子元素集合，通过 appendChild 放置进去
      status - 表示 用户到底是首次放置组件，还是再次访问组件
    },
  }
*/

/**
 * AliveProvider - KeepAlive 的根容器
 * @description AliveProvider 需要给到下面的后代高阶组件提供方法
 */
class AliveProvider extends Component {
  constructor(props) {
    super(props);

    this.keepAliveMap = {};
    this.aliveId = null;

    this.state = {};
  }

  /** 设置 keepAliveMap */
  setKeepAliveMap({ type, payload }) {
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
      case OperateAliveComponentMapTypes.RemoveCache:
        if (keepAliveMap.hasOwnProperty(aliveId)) {
          delete keepAliveMap[aliveId];
          this.keepAliveMap = keepAliveMap;
        }
        break;
      case OperateAliveComponentMapTypes.ClearCache:
        this.keepAliveMap = {};
      default:
        break;
    }
  }

  /** 渲染 KeepAliveMap 里面的 item */
  renderKeepAliveComponent({ aliveId, wrapRef }) {
    const { keepAliveMap } = this;
    const keepAliveMapItem = keepAliveMap[aliveId];

    Object.values(keepAliveMap).forEach(mapItem => {
      const itemNodes = mapItem.nodes;
      const itemAliveId = mapItem.aliveId;

      if (!itemNodes) {
        return;
      }

      if (itemAliveId === aliveId) {
        itemNodes.forEach(el => el.style.display = '');
      } else {
        itemNodes.forEach(el => el.style.display = 'none');
      }
    });

    if (keepAliveMapItem) {
      const { status, reactElement, nodes } = keepAliveMapItem;
      const oWrap = wrapRef.current;

      if (status === OperateAliveComponentMapTypes.UpdateCache) {
        const oFrag = document.createDocumentFragment();
        nodes.forEach(n => {
          oFrag.appendChild(n);
        });
        //// 直接渲染 (bad)
        //// oWrap.appendChild(oFrag);

        // 渲染到父节点上面
        oWrap.parentNode.appendChild(oFrag);
      } else {
        //// 直接渲染 (bad)
        //// render(
        ////   reactElement,
        ////   oWrap
        //// );

        // 渲染到父节点上面
        const prevChildren = [...oWrap.parentNode.childNodes];
        render(
          createPortal(reactElement, oWrap.parentNode),
          oWrap
        );
        setTimeout(() => {
          const nodes = [...oWrap.parentNode.childNodes].filter(n => !prevChildren.includes(n));
          
          this.setKeepAliveMap({
            type: OperateAliveComponentMapTypes.UpdateCache,
            payload: {
              aliveId,
              nodes,
            },
          });
        });
      }
    }

    this.aliveId = aliveId;
  }
  
  /** 根据 aliveId 获取当前组件的状态 */
  getStatus({ aliveId }) {
    const { keepAliveMap } = this;

    if (keepAliveMap[aliveId] !== undefined) {
      return OperateAliveComponentMapTypes.UpdateCache;
    }
    return OperateAliveComponentMapTypes.AddCache;
  }

  /** 获取当前的aliveId */
  getAliveId() {
    return this.aliveId;
  }

  /** 获取当前的 scopeMap 里面的值 */
  getScopeMap() {
    return this.keepAliveMap;
  }

  render() {
    const { children } = this.props;

    const setKeepAliveMap = this.setKeepAliveMap.bind(this);
    const renderKeepAliveComponent = this.renderKeepAliveComponent.bind(this);
    const getStatus = this.getStatus.bind(this);
    const getScopeMap = this.getScopeMap.bind(this);
    const getAliveId = this.getAliveId.bind(this);

    return (
      <KeepAliveContext.Provider value={{
        setKeepAliveMap,
        renderKeepAliveComponent,
        getStatus,
        getScopeMap,
        getAliveId,
      }}>
        { children }
      </KeepAliveContext.Provider>
    );
  }
}

export {
  AliveProvider,
}
