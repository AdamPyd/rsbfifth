import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from "react-router-config";//引入了ant design的图标和按钮
import routes from "./router";

class RouterIndex extends React.Component {
    render() {
        return (
            <BrowserRouter>
                { renderRoutes(routes) }
            </BrowserRouter>
        );
    }
}

export default RouterIndex;