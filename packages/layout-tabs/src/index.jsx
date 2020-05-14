import React, { useEffect, useState, Fragment } from 'react';
import { history } from 'umi';
import { Tabs } from 'antd';
import Iframe from './Iframe';
import RenderContent from './RenderContent';
import './index.css';

export default (props = {}) => {
  const dataSource = props.dataSource || [];
  const [tabAllKey, setTabAllKey] = useState([props.activeKey]);
  useEffect(() => {
    if (!tabAllKey.includes(props.activeKey)) {
      tabAllKey.push(props.activeKey);
      setTabAllKey([...tabAllKey]);
    }
  }, [props.activeKey]);
  let data = [];
  dataSource.forEach((item, index) => {
    if (tabAllKey.includes(item.path)) {
      const idx = tabAllKey.indexOf(item.path);
      data[idx] = item;
    }
  });
  data = data.filter(Boolean);
  return (
    <Fragment>
      {ANTD_IS_TABS && (
        <Tabs
          type="editable-card"
          className="antdps-global-tabs"
          hideAdd={true}
          activeKey={props.activeKey}
          onTabClick={(targetKey) => {
            history.push(targetKey);
          }}
          onEdit={(targetKey, action) => {
            let index = 0;
            const dataKeys = tabAllKey.filter((path, idx) => {
              if (path === targetKey) {
                index = idx;
              }
              return path !== targetKey;
            });
            let activeKey = '';
            if (dataKeys && dataKeys.length > 0) {
              activeKey = dataKeys[index === 0 ? 0 : index - 1];
            }
            setTabAllKey([...dataKeys]);
            history.push(activeKey);
          }}
        >
          {data.map((pane, index) => (
            <Tabs.TabPane
              tab={pane.name}
              key={pane.path}
              closable={data.length !== 1}
            />
          ))}
        </Tabs>
      )}
      {data.map((pane, index) => {
        if (!pane) return null;
        const isShowView = pane.path === props.activeKey;
        const Comp = /(function|object)/.test(typeof pane.component)
          ? pane.component
          : null;
        if (!Comp) return null;
        if (ANTD_IS_IFRAME_RENDER) {
          return (
            <Iframe
              bodyPadding={props.bodyPadding}
              isShowView={isShowView}
              child={<Comp />}
              key={index}
            />
          );
        }
        if (ANTD_IS_TABS) {
          return (
            <RenderContent
              bodyPadding={props.bodyPadding}
              isShowView={isShowView}
              child={<Comp />}
              key={index}
            />
          );
        }
        if (isShowView) {
          return (
            <div key={index} style={{ padding: props.bodyPadding || 14 }}>
              <Comp />
            </div>
          );
        }
        return null;
      })}
    </Fragment>
  );
};
