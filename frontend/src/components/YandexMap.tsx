import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

declare global {
  interface Window {
    ymaps: any;
  }
}

interface YandexMapProps {
  center: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title?: string;
    onClick?: () => void;
  }>;
  userLocation?: [number, number];
  draggableMarker?: {
    lat: number;
    lng: number;
    onDragEnd: (lat: number, lng: number) => void;
  };
  showZoomControls?: boolean;
  zoomControlsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const YandexMap: React.FC<YandexMapProps> = ({
  center,
  zoom = 13,
  onMapClick,
  markers = [],
  userLocation,
  draggableMarker,
  showZoomControls = true,
  zoomControlsPosition = 'bottom-right',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markerRefs = useRef<any[]>([]);
  const clustererRef = useRef<any>(null);
  const draggableMarkerRef = useRef<any>(null);
  const userLocationRef = useRef<any>(null);

  useEffect(() => {
    if (!window.ymaps) {
      const checkYMaps = setInterval(() => {
        if (window.ymaps) {
          clearInterval(checkYMaps);
          initMap();
        }
      }, 100);
      return () => clearInterval(checkYMaps);
    } else {
      initMap();
    }
  }, []);

  const initMap = () => {
    if (!mapContainerRef.current || !window.ymaps) return;

    window.ymaps.ready(() => {
      if (!mapContainerRef.current) return;

      const map = new window.ymaps.Map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        controls: showZoomControls ? ['zoomControl'] : [],
      });

      // Customize zoom controls position
      if (showZoomControls) {
        const positionMap: Record<string, any> = {
          'top-left': { top: 10, left: 10 },
          'top-right': { top: 10, right: 10 },
          'bottom-left': { bottom: 10, left: 10 },
          'bottom-right': { bottom: 80, right: 10 }, // Adjusted to avoid conflict
        };
        map.controls.get('zoomControl').options.set(positionMap[zoomControlsPosition] || positionMap['bottom-right']);
      }

      // Modern map styling
      map.options.set('theme', 'light');
      
      // Handle map click
      if (onMapClick) {
        map.events.add('click', (e: any) => {
          const coords = e.get('coords');
          onMapClick(coords[0], coords[1]);
        });
      }

      mapRef.current = map;

      // Add user location marker
      if (userLocation) {
        const userMarker = new window.ymaps.Placemark(
          userLocation,
          {
            iconCaption: 'You are here',
          },
          {
            preset: 'islands#blueCircleDotIcon',
            draggable: false,
          }
        );
        map.geoObjects.add(userMarker);
        userLocationRef.current = userMarker;
      }

      // Add draggable marker for location picker
      if (draggableMarker) {
        const dragMarker = new window.ymaps.Placemark(
          [draggableMarker.lat, draggableMarker.lng],
          {
            iconCaption: 'Drag to select location',
          },
          {
            preset: 'islands#redCircleDotIcon',
            draggable: true,
          }
        );

        dragMarker.events.add('dragend', () => {
          const coords = dragMarker.geometry.getCoordinates();
          draggableMarker.onDragEnd(coords[0], coords[1]);
        });

        map.geoObjects.add(dragMarker);
        draggableMarkerRef.current = dragMarker;
      }

      // Add listing markers with clustering (will be updated via useEffect)
      // Initial markers are added in useEffect after map is ready

      setIsLoaded(true);
    });
  };

  // Update map center
  useEffect(() => {
    if (mapRef.current && isLoaded) {
      mapRef.current.setCenter(center, zoom);
    }
  }, [center, zoom, isLoaded]);

  // Update draggable marker position
  useEffect(() => {
    if (draggableMarkerRef.current && draggableMarker && isLoaded) {
      draggableMarkerRef.current.geometry.setCoordinates([draggableMarker.lat, draggableMarker.lng]);
    }
  }, [draggableMarker?.lat, draggableMarker?.lng, isLoaded]);

  // Update markers with clustering
  useEffect(() => {
    if (!mapRef.current || !isLoaded || !window.ymaps) {
      console.log('Map not ready for markers:', { isLoaded, hasMap: !!mapRef.current, hasYMaps: !!window.ymaps });
      return;
    }

    const updateMarkers = () => {
      if (!mapRef.current) return;

      console.log('Updating markers:', markers.length);

      // Remove old clusterer
      if (clustererRef.current) {
        mapRef.current.geoObjects.remove(clustererRef.current);
        clustererRef.current = null;
      }
      markerRefs.current = [];

      // Add new markers with clustering
      if (markers.length > 0) {
        console.log('Adding markers to map:', markers);
        const clusterer = new window.ymaps.Clusterer({
          preset: 'islands#blueClusterIcons',
          groupByCoordinates: false,
          clusterDisableClickZoom: false,
          clusterHideIconOnBalloonOpen: false,
          geoObjectHideIconOnBalloonOpen: false,
          clusterBalloonContentLayout: 'cluster#balloonCarousel',
          clusterBalloonItemContentLayout: 'cluster#balloonCarouselItem',
          clusterBalloonPanelMaxMapArea: 0,
          clusterBalloonContentLayoutWidth: 200,
          clusterBalloonContentLayoutHeight: 150,
          clusterBalloonPagerSize: 5,
          clusterBalloonPagerType: 'numeric',
          clusterBalloonPagerVisible: true,
        });

        markers.forEach((marker) => {
          console.log('Adding marker:', marker.lat, marker.lng);
          const placemark = new window.ymaps.Placemark(
            [marker.lat, marker.lng],
            {
              balloonContent: marker.title || '',
              balloonContentHeader: marker.title || '',
            },
            {
              preset: 'islands#blueIcon',
            }
          );

          if (marker.onClick) {
            placemark.events.add('click', marker.onClick);
          }

          clusterer.add(placemark);
          markerRefs.current.push(placemark);
        });

        mapRef.current.geoObjects.add(clusterer);
        clustererRef.current = clusterer;
        console.log('Markers added successfully');

        // Fit map to show all markers (optional - might conflict with user location)
        // Uncomment if you want auto-fit
        // setTimeout(() => {
        //   const bounds = clusterer.getBounds();
        //   if (bounds) {
        //     mapRef.current.setBounds(bounds, {
        //       checkZoomRange: true,
        //       duration: 300,
        //     });
        //   }
        // }, 100);
      } else {
        console.log('No markers to display');
      }
    };

    if (window.ymaps.ready) {
      window.ymaps.ready(updateMarkers);
    } else {
      updateMarkers();
    }
  }, [markers, isLoaded]);

  return <MapContainer ref={mapContainerRef} />;
};

export default YandexMap;

