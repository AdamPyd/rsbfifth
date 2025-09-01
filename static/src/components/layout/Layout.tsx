import React from 'react';
import { Layout, Typography } from 'antd';
import UserIndex from '../user/index/UserIndex';
import './Layout.css';

const { Header, Footer } = Layout;
const { Text } = Typography;

interface LayoutComponentProps {
    showEarth: boolean;
    handleBackToHome: () => void;
    userMenuItems: any[];
}

const LayoutComponent: React.FC<LayoutComponentProps> = ({
                                                             showEarth,
                                                             handleBackToHome,
                                                             userMenuItems
                                                         }) => {
    return (
        <>
            <Header style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                zIndex: 20
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%'
                }}>
                    <Text
                        onClick={showEarth ? handleBackToHome : undefined}
                        style={{
                            color: '#fff',
                            fontSize: 20,
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            cursor: showEarth ? 'pointer' : 'default'
                        }}
                    >
                        DISCOVERY
                    </Text>
                    <div style={{ flex: 1 }} />

                    <UserIndex userMenuItems={userMenuItems} />
                </div>
            </Header>

            {/*<Footer style={{*/}
                {/*textAlign: 'center',*/}
                {/*background: 'rgba(0, 0, 0, 0.3)',*/}
                {/*borderTop: '1px solid rgba(255, 255, 255, 0.1)',*/}
                {/*color: 'rgba(255, 255, 255, 0.6)',*/}
                {/*zIndex: 20*/}
            {/*}}>*/}
                {/*© {new Date().getFullYear()} 让思想的脚印延伸向视距外*/}
            {/*</Footer>*/}
        </>
    );
};

export default LayoutComponent;