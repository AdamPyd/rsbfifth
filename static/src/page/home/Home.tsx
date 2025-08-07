import React, { useState, useEffect } from 'react';
import { Card, Spin } from 'antd';
import { ApiResponse, SampleData } from '../../types/api';
import { apiClient } from '../../utils/api';

// static/src/views/Home.tsx
const API_BASE = process.env.REACT_APP_API_BASE || '';

const Home: React.FC = () => {
    const [data, setData] = useState<SampleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 使用统一的 API 客户端
                const result: ApiResponse<SampleData> = await apiClient.get('/hello.json');

                if (result.error) {
                    setError(result.error);
                } else if (result.data) {
                    setData(result.data);
                }
            } catch (err) {
                setError('Failed to fetch data');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Card
            title="rsbfifth Application"
            style={{ width: 500, margin: '50px auto' }}
        >
            {loading ? (
                <Spin tip="Loading..." size="large" >
                    loading...
                </Spin>
            ) : error ? (
                <div style={{ color: 'red' }}>Error: {error}</div>
            ) : data ? (
                <div>
                    <h3>React + TypeScript + SpringBoot</h3>
                    <p>{data.message}</p>
                    <p>Timestamp: {data.timestamp}</p>
                </div>
            ) : (
                <div>No data available</div>
            )}
        </Card>
    );
};

export default Home;