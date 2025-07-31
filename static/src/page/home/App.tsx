import * as React from 'react';
import { Button } from 'antd'; //引入了ant design的图标和按钮
import { Icon } from '@ant-design/compatible';
import history from '../../router/history';
import axiosRequestConfig from '../../router/axiosRequestConfig'
import axiosUtil from '../../router/axiosUtil'
import logo from '../../logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props: any) {
    super(props);
    this.loginOutMethod = this.loginOutMethod.bind(this);
  }

  loginOutMethod() {
    const testConfig = axiosRequestConfig.testConfig;
    const config = {
      param: { t: new Date().getTime() },
      callback: (response: any) => {
      alert(response);
        if (response.data.code === 0) {
          history.push('/');
        }
      }
    }
    const finalConfig = { ...testConfig, ...config };
    axiosUtil.axiosMethod(finalConfig);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
          {/*{ renderRoutes(routes) }*/}
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Button type="primary">AntDesgin按钮</Button>
        <Icon style={{ color: 'green', fontSize: '24px', marginLeft: '50px' }} type="check-circle-o" />
        <br/>
        <Button style={{marginTop:'30px'}} onClick={this.loginOutMethod}>测试后端接口</Button>
      </div>
    );
  }
}

export default App;