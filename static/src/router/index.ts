// router.js

import App from '../page/home/App'
// import About from '../components/About'
// import Other from '../components/Other'
// import User from '../components/User'
// import Login from '../components/Login'
// import Discover from '../components/Discover'
// import {Hot, TopList, PlayList} from '../components/Discover';

const routers = [
    // {
    //     path:'/home',
    //     // exact:true,
    //     component: App
    // },
    {
        path: '/',
        // component: App,
        // exact: true,
        redirect: '/home',
        routes: [
            {
                path: '/home',
                component: App,
                exact:true,
                routes: []
            }
        ]
    }
    // {
    //     path:'/about/:name/:age',
    //     exact:true,
    //     component: About
    // },
    // {
    //     path:'/user',
    //     exact:true,
    //     component: User
    // },
    // {
    //     path:'/login',
    //     exact:true,
    //     component: Login
    // },
    // {
    //     path:'/discover',
    //     component: Discover,
    //     routes:[
    //         {
    //             path:'/discover',
    //             exact:true,
    //             component: Hot,
    //         },
    //         {
    //             path:'/discover/toplist',
    //             exact:true,
    //             component: TopList,
    //         },
    //         {
    //             path:'/discover/playlist',
    //             exact:true,
    //             component: PlayList,
    //         },
    //     ]
    // },
    // {
    //     component: Other
    // },
];
export default routers;