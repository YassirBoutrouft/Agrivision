import React, { useState } from "react";
import * as GeoTIFF from "geotiff";

export default function LocalGeoTiffViewer() {
  const [imageSrc, setImageSrc] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setError(null);
      setImageSrc(null);
      console.log("📂 Chargement du fichier:", file.name);

      // Lecture du TIFF
      const tiff = await GeoTIFF.fromBlob(file);
      const image = await tiff.getImage();

      // Extraction des métadonnées
      const width = image.getWidth();
      const height = image.getHeight();
      const bbox = image.getBoundingBox();
      const samplesPerPixel = image.getSamplesPerPixel();
      setMetadata({ width, height, bbox, samplesPerPixel });

      console.log(`📏 Taille: ${width}x${height}, 📌 BBox: ${bbox}, 🎨 Canaux: ${samplesPerPixel}`);

      // Lire les données raster
      const rasterData = await image.readRasters({ interleave: true });
      console.log("✅ Raster data chargé:", rasterData.length);

      // Affichage sur un canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      const imgData = ctx.createImageData(width, height);

      // Convertir le raster en image
      for (let i = 0; i < rasterData.length / samplesPerPixel; i++) {
        imgData.data[i * 4] = rasterData[i * samplesPerPixel]; // Rouge
        imgData.data[i * 4 + 1] = rasterData[i * samplesPerPixel + 1] || rasterData[i * samplesPerPixel]; // Vert
        imgData.data[i * 4 + 2] = rasterData[i * samplesPerPixel + 2] || rasterData[i * samplesPerPixel]; // Bleu
        imgData.data[i * 4 + 3] = 255; // Opacité
      }

      ctx.putImageData(imgData, 0, 0);
      setImageSrc(canvas.toDataURL());

    } catch (err) {
      console.error("🚨 Erreur lors du chargement du GeoTIFF :", err);
      setError("Impossible de lire le fichier TIFF.");
    }
  };

  return (
    <div className="geo-tiff-viewer">
      <h2>📌 Visualisation GeoTIFF</h2>
      <input type="file" accept=".tif" onChange={handleFileChange} />

      {metadata && (
        <div>
          <h3>📌 Métadonnées :</h3>
          <p>📏 Dimensions : {metadata.width} × {metadata.height}</p>
          <p>🌍 Bounding Box: {metadata.bbox.join(", ")}</p>
          <p>🎨 Canaux: {metadata.samplesPerPixel}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
      {imageSrc && <img src={imageSrc} alt="GeoTIFF" style={{ width: "100%", marginTop: "10px" }} />}
    </div>
  );
}
