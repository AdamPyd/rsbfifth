// src/services/api.ts

import { UserLocation, RegionData } from '../types/types';

// 模拟用户位置数据
export const fetchUserLocation = async (): Promise<UserLocation> => {
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

// 生成模拟的日期数据
const generateDateData = (baseDate: Date, regionCode: string, hasWater: boolean) => {
    const dateStr = baseDate.toISOString().split('T')[0];

    // 根据区域代码生成不同的天气数据
    let weather, minTemp, maxTemp;

    if (regionCode === '330100') { // 杭州
        weather = "晴";
        minTemp = 18;
        maxTemp = 28;
    } else if (regionCode === '330200') { // 宁波
        weather = "多云";
        minTemp = 17;
        maxTemp = 26;
    } else if (regionCode === '330300') { // 温州
        weather = "小雨";
        minTemp = 16;
        maxTemp = 24;
    } else { // 其他地区
        weather = "阴";
        minTemp = 15;
        maxTemp = 23;
    }

    return {
        [dateStr]: {
            weather: weather,
            temperature: {
                min: minTemp,
                max: maxTemp,
                hourly: Array.from({length: 24}, (_, i) => {
                    // 生成一天内的小时温度变化
                    const hour = i;
                    const baseTemp = minTemp + (maxTemp - minTemp) * Math.sin((hour - 6) * Math.PI / 24);
                    return Math.round(baseTemp + (Math.random() * 2 - 1));
                })
            },
            humidity: {
                min: 45,
                max: 85,
                hourly: Array.from({length: 24}, (_, i) => {
                    // 生成一天内的小时湿度变化
                    const hour = i;
                    const baseHumidity = 60 + 25 * Math.sin((hour - 3) * Math.PI / 24);
                    return Math.round(baseHumidity + (Math.random() * 10 - 5));
                })
            },
            uvIndex: Math.floor(Math.random() * 5) + 3,
            airQuality: {
                aqi: Math.floor(Math.random() * 50) + 20,
                pm25: Math.floor(Math.random() * 30) + 10,
                pm10: Math.floor(Math.random() * 40) + 15
            },
            warnings: Math.random() > 0.8 ? ["大风预警", "高温预警"] : [],
            tide: hasWater ? {
                high: [
                    { time: `${Math.floor(Math.random() * 3) + 5}:${Math.floor(Math.random() * 60)}`, height: 2.5 + Math.random() * 1.5 },
                    { time: `${Math.floor(Math.random() * 3) + 17}:${Math.floor(Math.random() * 60)}`, height: 2.8 + Math.random() * 1.2 }
                ],
                low: [
                    { time: `${Math.floor(Math.random() * 3) + 11}:${Math.floor(Math.random() * 60)}`, height: 0.5 + Math.random() * 0.8 },
                    { time: `${Math.floor(Math.random() * 3) + 23}:${Math.floor(Math.random() * 60)}`, height: 0.7 + Math.random() * 0.6 }
                ]
            } : undefined
        }
    };
};

// 模拟区域数据
export const fetchRegionData = async (regionCode: string): Promise<RegionData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const hasWater = regionCode === '330100' || regionCode === '330200'; // 杭州和宁波有水域
            const today = new Date();

            // 生成最近30天的数据
            const weatherData = {};
            for (let i = 0; i < 30; i++) {
                const date = new Date();
                date.setDate(today.getDate() - i);
                Object.assign(weatherData, generateDateData(date, regionCode, hasWater));
            }

            resolve({
                regionName: getRegionName(regionCode),
                regionCode,
                hasWater,
                weatherData
            });
        }, 500);
    });
};

// 根据区域代码获取区域名称
const getRegionName = (regionCode: string): string => {
    const regionMap: {[key: string]: string} = {
        '330000': '浙江省',
        '330100': '杭州市',
        '330200': '宁波市',
        '330300': '温州市',
        '330400': '嘉兴市',
        '330500': '湖州市',
        '330600': '绍兴市',
        '330700': '金华市',
        '330800': '衢州市',
        '330900': '舟山市',
        '331000': '台州市',
        '331100': '丽水市'
    };

    return regionMap[regionCode] || '未知区域';
};