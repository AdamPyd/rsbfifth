// src/services/mapData.ts

// 模拟地图数据加载
export const loadMapData = async (regionType: string): Promise<any> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 返回模拟的GeoJSON数据
            resolve({
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {
                            name: '杭州市',
                            code: '330100',
                            center: [120.15507, 30.274085],
                            elevation: 2.5
                        },
                        geometry: {
                            type: 'MultiPolygon',
                            coordinates: [
                                [
                                    [
                                        [120.0, 30.0],
                                        [121.0, 30.0],
                                        [121.0, 31.0],
                                        [120.0, 31.0],
                                        [120.0, 30.0]
                                    ]
                                ]
                            ]
                        }
                    },
                    {
                        type: 'Feature',
                        properties: {
                            name: '宁波市',
                            code: '330200',
                            center: [121.54979, 29.86839],
                            elevation: 2.0
                        },
                        geometry: {
                            type: 'MultiPolygon',
                            coordinates: [
                                [
                                    [
                                        [121.0, 29.5],
                                        [122.0, 29.5],
                                        [122.0, 30.0],
                                        [121.0, 30.0],
                                        [121.0, 29.5]
                                    ]
                                ]
                            ]
                        }
                    },
                    {
                        type: 'Feature',
                        properties: {
                            name: '温州市',
                            code: '330300',
                            center: [120.69939, 27.99492],
                            elevation: 1.8
                        },
                        geometry: {
                            type: 'MultiPolygon',
                            coordinates: [
                                [
                                    [
                                        [120.0, 27.5],
                                        [121.0, 27.5],
                                        [121.0, 28.5],
                                        [120.0, 28.5],
                                        [120.0, 27.5]
                                    ]
                                ]
                            ]
                        }
                    }
                ]
            });
        }, 500);
    });
};

// 模拟区域GeoJSON加载
export const loadRegionGeoJson = async (regionCode: string): Promise<any> => {
    return loadMapData('city');
};