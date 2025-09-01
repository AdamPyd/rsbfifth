import React from 'react';
import { Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './UserIndex.css';


interface UserIndexProps {
    userMenuItems: any[];
}

const UserIndex: React.FC<UserIndexProps> = ({ userMenuItems }) => {
    return (
        <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['hover']}
        >
            <div style={{
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <UserOutlined style={{ color: '#fff', fontSize: '18px' }} />
            </div>
        </Dropdown>
    );
};

export default UserIndex;