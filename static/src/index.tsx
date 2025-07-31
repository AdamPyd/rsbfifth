import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import Login from './component/test/Login';
import { HashRouter as Router, Route } from 'react-router-dom';
import history from './router/history';
import requestConfig from './router/axiosRequestConfig'
import utils from './router/axiosUtil'

// import './index.css';
import App from './page/home/App';
import * as serviceWorker from './serviceWorker';

import './index.css';

class Model extends React.Component {
//   constructor(props: any) {
//     super(props);
//   }

  componentDidMount() {
    // const loginStateConfig = requestConfig.loginStateConfig;
    const loginStateConfig = requestConfig.testConfig;
    const config = {
      param: { t: new Date().getTime() },
      callback: (response: any) => {
        const location = window.location;
        const hash = location?.hash;
        const pathname = location?.pathname;
        if (response?.data || hash) {
          // 在走实际的 history.push 的时候，需要将带有 hash 前缀的 # 去掉
          history.push(hash.replace('#', ''));
        } else if (response?.data || pathname) {
          // 若 hash 为空、pathname 不为空，则取 pathname
          history.push('/home');
        } else if (response?.data) {
          // 若 hash、pathname 均为空，走首页
          history.push('/home');
        } else {
          history.push('/');
        }
      }
    };
    const finalConfig = { ...loginStateConfig, ...config };
    utils.axiosMethod(finalConfig);
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <Route exact={true} path="/home" component={App} />
        <Route exact={true} path="/a" component={App} />
      </div>
    )
  }
}

ReactDOM.render(
  <Router history={history}>
      <Model />
    </Router>,
  document.getElementById('root') as HTMLElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
