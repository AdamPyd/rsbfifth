import React from 'react';
import { Modal, Button, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './UserLoginOrRegister.css';

interface LoginModalProps {
    visible: boolean;
    onCancel: () => void;
    onLogin: (values: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onCancel, onLogin }) => {
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        onLogin(values);
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="用户登录"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={350}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password placeholder="请输入密码" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default LoginModal;