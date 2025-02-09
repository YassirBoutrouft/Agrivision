from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import os

app = Flask(__name__)
CORS(app)

STORAGE_PATH = "/data/images"
OUTPUT_PATH = "/app/processed"

def calculate_ndvi(image):
   """Calcule l'indice NDVI avec une meilleure normalisation"""
   # Extraire et normaliser les bandes
   red = image[:, :, 2].astype(float) / 255.0
   nir = image[:, :, 0].astype(float) / 255.0
   
   # Calcul NDVI avec gestion des divisions par zéro
   denominator = nir + red
   ndvi = np.zeros_like(denominator)
   valid_mask = denominator > 0
   ndvi[valid_mask] = (nir[valid_mask] - red[valid_mask]) / denominator[valid_mask]
   
   return ndvi

def create_enhanced_visualization(ndvi, original_image):
   """Crée une visualisation améliorée avec plus d'informations"""
   # Normaliser NDVI pour visualisation
   ndvi_normalized = ((ndvi + 1) * 127.5).astype(np.uint8)
   
   # Créer une colormap
   ndvi_colored = cv2.applyColorMap(ndvi_normalized, cv2.COLORMAP_JET)
   
   # Créer la barre de légende
   legend_height = 60
   legend = np.zeros((legend_height, ndvi_colored.shape[1], 3), dtype=np.uint8)
   
   # Créer le gradient de couleur
   for i in range(ndvi_colored.shape[1]):
       value = int(i * 255 / ndvi_colored.shape[1])
       color = cv2.applyColorMap(np.array([[value]], dtype=np.uint8), cv2.COLORMAP_JET)[0, 0]
       legend[:40, i] = color

   # Ajouter le texte avec cv2.putText
   font = cv2.FONT_HERSHEY_SIMPLEX
   cv2.putText(legend, 'Stress hydrique', (10, 30), font, 0.5, (255, 255, 255), 1)
   cv2.putText(legend, 'Vegetation saine', (legend.shape[1]-130, 30), font, 0.5, (255, 255, 255), 1)
   
   # Ajouter les valeurs NDVI
   cv2.putText(legend, '-1.0', (10, 55), font, 0.4, (255, 255, 255), 1)
   cv2.putText(legend, '-0.5', (legend.shape[1]//4, 55), font, 0.4, (255, 255, 255), 1)
   cv2.putText(legend, '0.0', (legend.shape[1]//2, 55), font, 0.4, (255, 255, 255), 1)
   cv2.putText(legend, '0.5', (3*legend.shape[1]//4, 55), font, 0.4, (255, 255, 255), 1)
   cv2.putText(legend, '1.0', (legend.shape[1]-30, 55), font, 0.4, (255, 255, 255), 1)
   
   # Créer la zone de statistiques
   stats_height = 40
   stats = np.zeros((stats_height, ndvi_colored.shape[1], 3), dtype=np.uint8)
   
   # Calculer les statistiques
   vegetation_healthy = np.mean(ndvi > 0.2) * 100
   stress_zone = np.mean(ndvi < 0) * 100
   ndvi_mean = np.mean(ndvi)
   
   # Ajouter les statistiques
   cv2.putText(stats, f'Vegetation saine: {vegetation_healthy:.1f}%', (10, 15), font, 0.4, (255, 255, 255), 1)
   cv2.putText(stats, f'Zone de stress: {stress_zone:.1f}%', (10, 35), font, 0.4, (255, 255, 255), 1)
   cv2.putText(stats, f'NDVI moyen: {ndvi_mean:.3f}', (legend.shape[1]-150, 25), font, 0.4, (255, 255, 255), 1)
   
   # Combiner les images
   result = np.vstack((ndvi_colored, legend, stats))
   
   return result

@app.route('/api/ndvi', methods=['POST'])
def process_ndvi():
   try:
       data = request.json
       image_url = data['imagePath']
       relative_path = image_url.split('/files/')[-1]
       image_path = os.path.join(STORAGE_PATH, relative_path)
       
       if not os.path.exists(image_path):
           raise Exception(f"Image non trouvée: {image_path}")

       # Lire l'image
       image = cv2.imread(image_path)
       if image is None:
           return jsonify({'error': 'Impossible de lire l\'image'}), 400

       # Calculer NDVI
       ndvi = calculate_ndvi(image)

       # Créer la visualisation améliorée
       result = create_enhanced_visualization(ndvi, image)

       # Sauvegarder le résultat
       os.makedirs(OUTPUT_PATH, exist_ok=True)
       output_filename = f"ndvi_{os.path.basename(image_path)}"
       output_path = os.path.join(OUTPUT_PATH, output_filename)
       cv2.imwrite(output_path, result)

       # Calculer les statistiques
       stats = {
           'ndvi_min': round(float(np.min(ndvi)), 3),
           'ndvi_max': round(float(np.max(ndvi)), 3),
           'ndvi_mean': round(float(np.mean(ndvi)), 3),
           'vegetation_health': round(float(np.mean(ndvi > 0.2)) * 100, 1),
           'stress_zone': round(float(np.mean(ndvi < 0)) * 100, 1)
       }

       return jsonify({
           'success': True,
           'processedImageUrl': f"http://localhost:5001/processed/{output_filename}",
           'stats': stats
       })

   except Exception as e:
       print("Erreur:", str(e))
       return jsonify({'error': str(e)}), 500

@app.route('/processed/<filename>')
def serve_processed_image(filename):
   return send_file(os.path.join(OUTPUT_PATH, filename))

if __name__ == '__main__':
   app.run(host='0.0.0.0', port=5001)