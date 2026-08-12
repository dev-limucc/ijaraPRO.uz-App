'use client'
import { useEffect, useRef, useState } from 'react'

interface YandexMapProps {
  center: [number, number]
  markers?: Array<{ lat: number; lng: number; title?: string }>
  onLocationChange?: (lat: number, lng: number) => void
  height?: string
}

export function YandexMap({
  center,
  markers = [],
  onLocationChange,
  height = '400px',
}: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [placemarks, setPlacemarks] = useState<any[]>([])

  useEffect(() => {
    if (!mapRef.current) return

    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY

    // Load Yandex Maps script
    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`
    script.async = true

    script.onload = () => {
      if ((window as any).ymaps) {
        ;(window as any).ymaps.ready(() => {
          const map = new (window as any).ymaps.Map(mapRef.current, {
            center,
            zoom: 12,
            controls: ['zoomControl'],
          })

          setMapInstance(map)

          // Add markers
          const newPlacemarks: any[] = []
          markers.forEach((marker) => {
            const placemark = new (window as any).ymaps.Placemark(
              [marker.lat, marker.lng],
              { balloonContent: marker.title || '' },
              {
                preset: 'islands#blueCircleDotIcon',
              }
            )
            map.geoObjects.add(placemark)
            newPlacemarks.push(placemark)
          })
          setPlacemarks(newPlacemarks)

          // Handle map clicks
          if (onLocationChange) {
            map.events.add('click', (e: any) => {
              const coords = e.get('coords')
              onLocationChange(coords[0], coords[1])
            })
          }
        })
      }
    }

    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  // Update markers when they change
  useEffect(() => {
    if (!mapInstance || !(window as any).ymaps) return

    // Remove old placemarks
    placemarks.forEach((pm) => {
      mapInstance.geoObjects.remove(pm)
    })

    // Add new placemarks
    const newPlacemarks: any[] = []
    markers.forEach((marker) => {
      const placemark = new (window as any).ymaps.Placemark(
        [marker.lat, marker.lng],
        { balloonContent: marker.title || '' },
        {
          preset: 'islands#blueCircleDotIcon',
        }
      )
      mapInstance.geoObjects.add(placemark)
      newPlacemarks.push(placemark)
    })
    setPlacemarks(newPlacemarks)
  }, [markers, mapInstance])

  // Update center when it changes
  useEffect(() => {
    if (mapInstance) {
      mapInstance.setCenter(center)
    }
  }, [center, mapInstance])

  return <div ref={mapRef} className="w-full rounded-2xl" style={{ height }} />
}

