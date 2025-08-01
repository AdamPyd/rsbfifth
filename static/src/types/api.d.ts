// 定义API响应类型
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

// 定义示例数据类型
export interface SampleData {
    message: string;
    timestamp: string;
}