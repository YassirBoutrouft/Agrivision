from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import os

app = Flask(__name__)
CORS(app)

STORAGE_PATH = "/data/images"
OUTPUT_PATH = "/app/processed"

@app.route('/api/edge-detection', methods=['POST'])
def detect_edges():
    try:
        data = request.json
        image_url = data['imagePath']
        # Extraire uniquement le chemin relatif
        relative_path = image_url.split('/files/')[-1]

        # Construire le chemin complet
        base_storage = "/data/images"  # Point de montage dans le conteneur

        image_path = os.path.join(STORAGE_PATH, relative_path)
        
        if not os.path.exists(image_path):
            raise Exception(f"Image non trouvée: {image_path}")

        # Lire l'image
        image = cv2.imread(image_path)
        if image is None:
            return jsonify({'error': 'Impossible de décoder l\'image'}), 400

        # Convertir en niveaux de gris et détecter les contours
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray_image, threshold1=100, threshold2=200)

        # Sauvegarder le résultat
        os.makedirs(OUTPUT_PATH, exist_ok=True)
        output_filename = f"edges_{os.path.basename(image_path)}"
        output_path = os.path.join(OUTPUT_PATH, output_filename)
        cv2.imwrite(output_path, edges)

        return jsonify({
            'success': True,
            'processedImageUrl': f"http://localhost:5004/processed/{output_filename}"
        })

    except Exception as e:
        print("Erreur:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/processed/<filename>')
def serve_processed_image(filename):
    return send_file(os.path.join(OUTPUT_PATH, filename))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004)
