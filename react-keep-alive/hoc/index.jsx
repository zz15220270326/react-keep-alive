import React, { Component, createRef } from 'react';
import { KeepAliveContext } from '../libs/contexts';
import { OperateAliveComponentMapTypes } from '../libs/configs';

function transToAliveComponent(WrapComponent, opts) {
  const options = typeof opts === 'object' && opts !== null
                ? { include: true, ...opts }
                : { include: true, id: opts };

  if (!options.id) {
    throw new Error('param "id" is required in options');
  }

  return class extends Component {
    static contextType = KeepAliveContext;

    constructor(props) {
      super(props);

      /** @type { import('react').RefObject<HTMLElement> } 容器的ref值 */
      this.wrapRef = createRef(null);
    }

    componentDidMount() {
      const {
        props: subProps,
        // context
      } = this;
      const {
        setKeepAliveMap,
        renderKeepAliveComponent,
        getStatus
      } = this.context;
      const aliveId = options.id;
      const wrapRef = this.wrapRef;
      const compStatus = getStatus({ aliveId });

      if (compStatus === OperateAliveComponentMapTypes.AddCache) {
        setKeepAliveMap({
          type: OperateAliveComponentMapTypes.AddCache,
          payload: {
            aliveId,
            reactElement: (
              <WrapComponent { ...subProps } />
            ),
            status: OperateAliveComponentMapTypes.AddCache,
            nodes: null
          },
        });
      }
      
      renderKeepAliveComponent({ aliveId, wrapRef });
    }
    
    render() {
      return (
        <div
          ref={(ref) => {
            this.wrapRef.current = ref;
          }}
          className={ `keep-alive-wrap&&${ options.id }` }
          style={{
            display: 'none'
          }}
        />
      );
      
      /* 用 【消费者】 */
      // return (
      //   <KeepAliveContext.Consumer>
      //     {
      //       ({
      //         setKeepAliveMap,
      //         renderKeepAliveComponent,
      //         getStatus,
      //       }) => {
      //         const aliveId = options.id;
      //         const wrapRef = this.wrapRef;
      //         const compStatus = getStatus({ aliveId });

      //         setTimeout(() => {
      //           if (compStatus === OperateAliveComponentMapTypes.AddCache) {
      //             setKeepAliveMap({
      //               type: OperateAliveComponentMapTypes.AddCache,
      //               payload: {
      //                 aliveId,
      //                 reactElement: <WrapComponent { ...subProps } />,
      //                 status: OperateAliveComponentMapTypes.AddCache,
      //                 nodes: null
      //               },
      //             });
      //           }
                
      //           renderKeepAliveComponent({ aliveId, wrapRef });
      //         });

      //         return (
      //           <div ref={ this.wrapRef }></div>
      //         );
      //       }
      //     }
      //   </KeepAliveContext.Consumer>
      // );
    }
  }
}

export {
  transToAliveComponent
};
