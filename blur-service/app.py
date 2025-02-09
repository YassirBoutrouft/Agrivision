from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import os

app = Flask(__name__)
CORS(app)

STORAGE_PATH = "/data/images"
OUTPUT_PATH = "/app/processed"

@app.route('/api/blur', methods=['POST'])
def apply_blur():
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

        # Appliquer le flou gaussien
        blurred = cv2.GaussianBlur(image, (15, 15), 0)

        # Sauvegarder le résultat
        os.makedirs(OUTPUT_PATH, exist_ok=True)
        output_filename = f"blur_{os.path.basename(image_path)}"
        output_path = os.path.join(OUTPUT_PATH, output_filename)
        cv2.imwrite(output_path, blurred)

        return jsonify({
            'success': True,
            'processedImageUrl': f"http://localhost:5008/processed/{output_filename}"
        })

    except Exception as e:
        print("Erreur:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/processed/<filename>')
def serve_processed_image(filename):
    return send_file(os.path.join(OUTPUT_PATH, filename))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5008)