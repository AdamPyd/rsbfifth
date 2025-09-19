// src/services/api.ts

import { UserLocation, RegionData } from '../types';

// 模拟用户位置数据
export const fetchUserLocation = async (): Promise<UserLocation> => {
    // 实际项目中这里应该调用真实API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                province: '浙江省',
                provinceCode: '330000',
                city: '杭州市',
                cityCode: '330100',
                district: '西湖区',
                districtCode: '330106',
                ip: '127.0.0.1'
            });
        }, 500);
    });
};

// 模拟区域数据
export const fetchRegionData = async (regionCode: string): Promise<RegionData> => {
    // 实际项目中这里应该调用真实API
    return new Promise((resolve) => {
        setTimeout(() => {
            const hasWater = regionCode === '330100' || regionCode === '330200'; // 杭州和宁波有水域

            resolve({
                regionName: regionCode === '330100' ? '杭州市' :
                    regionCode === '330200' ? '宁波市' : '浙江省',
                regionCode,
                hasWater,
                weatherData: {
                    '2023-10-01': {
                        weather: '晴',
                        temperature: {
                            min: 18,
                            max: 28,
                            hourly: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15]
                        },
                        humidity: {
                            min: 45,
                            max: 85,
                            hourly: [45, 48, 52, 55, 60, 65, 70, 75, 80, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15]
                        },
                        uvIndex: 6,
                        airQuality: {
                            aqi: 45,
                            pm25: 25,
                            pm10: 40
                        },
                        warnings: [],
                        tide: hasWater ? {
                            high: [{ time: '06:30', height: 3.2 }, { time: '18:45', height: 3.5 }],
                            low: [{ time: '12:15', height: 0.8 }, { time: '00:30', height: 1.0 }]
                        } : undefined
                    }
                }
            });
        }, 500);
    });
};