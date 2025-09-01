// src/hooks/useAuth.ts
import { useState } from 'react';
import { message } from 'antd';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    const login = (values) => {
        // 模拟登录成功
        setIsLoggedIn(true);
        setUserInfo({ username: values.username });
        message.success('登录成功');
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserInfo(null);
        message.success('已退出登录');
    };

    return { isLoggedIn, userInfo, login, logout };
};