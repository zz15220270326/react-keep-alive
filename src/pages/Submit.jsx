import React, { useEffect, useRef } from 'react';
import { useAliveScope, useScopeStatus } from 'react-keep-alive';

function SubmitPage(props) {
  const {
    scopeValue,
    setScopeValue
  } = useAliveScope();
  const { onMounted, onActived } = useScopeStatus();

  const formRef = useRef(null);

  const onResetBtnClick = () => {
    console.log('清除内容');
  }

  onMounted(() => {
    console.log('杀进来了11111');
  });
  onMounted(() => {
    console.log('杀进来了22222');
  });
  onMounted(() => {
    console.log('杀进来了33333');
  });

  onActived(() => {
    console.log('杀回来了');
  });

  const onSubmitBtnClick = (e) => {
    e.preventDefault();
    console.log(formRef.current);

    setScopeValue({ activeId: 'submit-page' });
  }

  useEffect(() => {
    console.log(scopeValue, 'scopeValue');
  }, [scopeValue]);

  return (
    <div className="form-page">
      <form ref={ formRef } className="submit-form" method="POST" action="">
        <div className="form-item">
          <label htmlFor="J_Username">用户名</label>
          <input type="text" id="J_Username" name="username" />
        </div>
        <div className="form-item">
          <label htmlFor="J_Password">密码</label>
          <input type="password" id="J_Password" name="password" />
        </div>
        <div className="form-item">
          <button type="reset" onClick={ onResetBtnClick }>清除</button>
          <button type="submit" onClick={ onSubmitBtnClick }>提交</button>
        </div>
      </form>
    </div>
  );
}

export default SubmitPage;
