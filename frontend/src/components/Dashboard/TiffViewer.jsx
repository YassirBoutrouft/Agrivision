import React, { useEffect, useState } from 'react';
import * as GeoTIFF from 'geotiff';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function TiffViewer({ imageUrl }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTiff() {
      try {
        const map = L.map('tiff-map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        const tiff = await GeoTIFF.fromUrl(imageUrl);
        const image = await tiff.getImage();
        const data = await image.readRasters();

        // TODO: Ajouter le traitement spécifique pour votre TIFF
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement TIFF:', error);
      }
    }

    loadTiff();
  }, [imageUrl]);

  return (
    <div className="h-full">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-500">Chargement du TIFF...</span>
        </div>
      ) : (
        <div id="tiff-map" className="h-full"></div>
      )}
    </div>
  );
}

export default TiffViewer;