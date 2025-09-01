import React from 'react';
import { Modal, Button, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './UserInfo.css';

const { Text } = Typography;

interface AccountModalProps {
    visible: boolean;
    onCancel: () => void;
    userInfo: any;
}

const AccountModal: React.FC<AccountModalProps> = ({ visible, onCancel, userInfo }) => {
    return (
        <Modal
            title="账户详情"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onCancel}>
                    关闭
                </Button>
            ]}
            width={400}
        >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Avatar size={64} icon={<UserOutlined />} style={{ marginBottom: 16 }} />
                <div>
                    <Text strong>用户名: </Text>
                    <Text>{userInfo?.username || '未命名用户'}</Text>
                </div>
                <div style={{ marginTop: 8 }}>
                    <Text type="secondary">这是您的账户信息页面</Text>
                </div>
            </div>
        </Modal>
    );
};

export default AccountModal;