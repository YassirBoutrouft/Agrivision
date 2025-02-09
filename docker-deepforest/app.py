from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from deepforest import main
import cv2
import os

app = Flask(__name__)
CORS(app)

model = main.deepforest()
model.use_release()

STORAGE_PATH = "/data/images"
OUTPUT_PATH = "/app/processed"

@app.route('/api/analyze-trees', methods=['POST'])
def analyze_trees():
    try:
        data = request.json
        image_url = data['imagePath']
        
        # Extraire uniquement le chemin relatif
        relative_path = image_url.split('/files/')[-1]
        
        # Construire le chemin complet
        base_storage = "/data/images"  # Point de montage dans le conteneur
        image_path = os.path.join(STORAGE_PATH, relative_path)
        
        print(f"URL reçue: {image_url}")
        print(f"Chemin relatif extrait: {relative_path}")
        print(f"Chemin complet dans le conteneur: {image_path}")
        
        if not os.path.exists(image_path):
            raise Exception(f"Image non trouvée au chemin: {image_path}")

        image = cv2.imread(image_path)
        boxes = model.predict_image(path=image_path)
        tree_count = len(boxes)

        for box in boxes.itertuples():
            cv2.rectangle(
                image,
                (int(box.xmin), int(box.ymin)),
                (int(box.xmax), int(box.ymax)),
                (0, 255, 0),
                2
            )
            cv2.putText(
                image,
                f"{box.score:.2f}",
                (int(box.xmin), int(box.ymin - 10)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 255, 0),
                2
            )

        os.makedirs(OUTPUT_PATH, exist_ok=True)
        output_filename = f"trees_{os.path.basename(image_path)}"
        output_path = os.path.join(OUTPUT_PATH, output_filename)
        cv2.imwrite(output_path, image)

        return jsonify({
            'success': True,
            'tree_count': tree_count,
            'processedImageUrl': f"http://localhost:5003/processed/{output_filename}"
        })

    except Exception as e:
        print("Erreur:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/processed/<filename>')
def serve_processed_image(filename):
    return send_file(os.path.join(OUTPUT_PATH, filename))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)