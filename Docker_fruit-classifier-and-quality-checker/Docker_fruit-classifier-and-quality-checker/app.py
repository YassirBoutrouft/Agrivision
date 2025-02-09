import os
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from flask_cors import CORS
import cv2

# Configuration
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
app = Flask(__name__)
CORS(app)

STORAGE_PATH = "/data/images"
OUTPUT_PATH = "/app/processed"

# Charger les modèles
try:
    fruit_model = load_model('fruit_classifier_model.h5', compile=False)
    print("Modèle principal chargé avec succès.")
except Exception as e:
    print(f"Erreur lors du chargement du modèle principal : {e}")
    exit(1)

def preprocess_image(image_path):
    img = image.load_img(image_path, target_size=(100, 100))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = img / 255.0
    return img

class_indices_to_fruits = {
    0: 'apple',
    1: 'banana',
    2: 'orange'
}

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        image_url = data['imagePath']
        relative_path = image_url.split('/files/')[-1]

        image_path = os.path.join(STORAGE_PATH, relative_path)
        
        if not os.path.exists(image_path):
            raise Exception(f"Image non trouvée: {image_path}")

        # Prétraiter l'image et faire la prédiction principale
        processed_image = preprocess_image(image_path)
        fruit_class = np.argmax(fruit_model.predict(processed_image), axis=1)[0]
        predicted_fruit = class_indices_to_fruits.get(fruit_class, 'Unknown')

        # Charger le modèle spécifique pour la classification de la qualité
        classification_model_path = f'{predicted_fruit}_classification_model.h5'
        try:
            classification_model = load_model(classification_model_path, compile=False)
            classification_result = classification_model.predict(processed_image)

            fresh_probability = classification_result[0][0] * 100
            not_fresh_probability = 100 - fresh_probability

            # Créer une image annotée avec les résultats
            original_image = cv2.imread(image_path)
            cv2.putText(
                original_image,
                f"Fruit: {predicted_fruit}",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )
            cv2.putText(
                original_image,
                f"Freshness: {round(fresh_probability, 2)}%",
                (10, 70),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )

            # Sauvegarder l'image annotée
            os.makedirs(OUTPUT_PATH, exist_ok=True)
            output_filename = f"fruit_{os.path.basename(image_path)}"
            output_path = os.path.join(OUTPUT_PATH, output_filename)
            cv2.imwrite(output_path, original_image)

            return jsonify({
                'success': True,
                'data': {
                    'fruit': predicted_fruit.capitalize(),
                    'freshness': round(fresh_probability, 2),
                    'not_freshness': round(not_fresh_probability, 2)
                },
                'processedImageUrl': f"http://localhost:5000/processed/{output_filename}"
            })

        except Exception as e:
            raise Exception(f"Erreur lors de la prédiction de la qualité : {e}")

    except Exception as e:
        print("Erreur:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/processed/<filename>')
def serve_processed_image(filename):
    return send_file(os.path.join(OUTPUT_PATH, filename))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
