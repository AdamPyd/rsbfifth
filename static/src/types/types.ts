// src/types.ts

export type RegionType = 'province' | 'city' | 'county';

export interface UserLocation {
    province: string;
    provinceCode: string;
    city: string;
    cityCode: string;
    district: string;
    districtCode: string;
    ip: string;
}

export interface WeatherData {
    weather: string;
    temperature: {
        min: number;
        max: number;
        hourly: number[];
    };
    humidity: {
        min: number;
        max: number;
        hourly: number[];
    };
    uvIndex: number;
    airQuality: {
        aqi: number;
        pm25: number;
        pm10: number;
    };
    warnings: string[];
    tide?: {
        high: Array<{ time: string; height: number }>;
        low: Array<{ time: string; height: number }>;
    };
}

export interface RegionData {
    regionName: string;
    regionCode: string;
    hasWater: boolean;
    weatherData: {
        [date: string]: WeatherData;
    };
}