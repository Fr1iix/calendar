'use client';

import React, { useEffect, useRef } from 'react';

interface Event {
    city: string;
    latitude: number;
    longitude: number;
}

interface YandexMapProps {
    events: Event[];
}

declare global {
    interface Window {
        ymaps: any;
    }
}

const YandexMap: React.FC<YandexMapProps> = ({ events }) => {
    const mapRef = useRef<any>(null);
    const isScriptLoading = useRef(false);

    useEffect(() => {
        let isMounted = true;

        const loadScript = (): Promise<void> => {
            return new Promise((resolve, reject) => {
                if (window.ymaps) {
                    resolve();
                    return;
                }

                if (isScriptLoading.current) {
                    const checkYmaps = setInterval(() => {
                        if (window.ymaps) {
                            clearInterval(checkYmaps);
                            resolve();
                        }
                    }, 100);
                    return;
                }

                isScriptLoading.current = true;
                const script = document.createElement('script');
                script.src = 'https://api-maps.yandex.ru/2.1/?apikey=e23525a3-7686-4fb2-8dd8-1c0239a9af62&lang=ru_RU';
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load Yandex Maps script'));
                document.body.appendChild(script);
            });
        };

        const initializeMap = async () => {
            try {
                await loadScript();

                if (!isMounted) return;

                await window.ymaps.ready();

                if (mapRef.current) {
                    // Очищаем предыдущую карту перед созданием новой
                    mapRef.current.destroy();
                }

                mapRef.current = new window.ymaps.Map('map', {
                    center: [55.751574, 37.573856], // Центр карты (Москва)
                    zoom: 4,
                });

                events.forEach((event) => {
                    const placemark = new window.ymaps.Placemark(
                        [event.latitude, event.longitude],
                        {
                            hintContent: event.city,
                            balloonContent: `Событие: ${event.city}`,
                        },
                        {
                            preset: 'islands#circleIcon',
                            iconColor: '#1E98FF',
                        }
                    );
                    mapRef.current.geoObjects.add(placemark);
                });
            } catch (error) {
                console.error('Error initializing Yandex Maps:', error);
            }
        };

        initializeMap();

        return () => {
            isMounted = false;
            if (mapRef.current) {
                mapRef.current.destroy();
                mapRef.current = null;
            }
        };
    }, [events]);

    return <div id="map" style={{ width: '100%', height: '600px' }} />;
};

export default YandexMap;