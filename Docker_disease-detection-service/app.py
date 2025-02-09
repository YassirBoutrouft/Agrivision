from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import os
import tensorflow as tf
from PIL import Image

# Initialisation de Flask
app = Flask(__name__)
CORS(app)

# Configuration des chemins
STORAGE_PATH = "/data/images"
OUTPUT_PATH = "/app/processed"
MODEL_PATH = 'PlantDNet.h5'

# Charger le modèle
try:
   model = tf.keras.models.load_model(MODEL_PATH, compile=False)
   print("Modèle chargé avec succès : PlantDNet.h5")
except Exception as e:
   print("Erreur lors du chargement du modèle :", str(e))
   model = None

def model_predict(img_path, model):
   """Prédire la maladie à partir de l'image."""
   from tensorflow.keras.preprocessing import image

   # Charger et prétraiter l'image
   img = image.load_img(img_path, target_size=(64, 64))
   x = image.img_to_array(img)
   x = np.expand_dims(x, axis=0)
   x = np.array(x, dtype="float32") / 255.0

   # Faire la prédiction
   preds = model.predict(x)
   return preds

@app.route('/api/disease-detection', methods=['POST'])
def disease_detection():
   try:
       data = request.json
       image_url = data['imagePath']
       relative_path = image_url.split('/files/')[-1]
       image_path = os.path.join(STORAGE_PATH, relative_path)
       
       if not os.path.exists(image_path):
           raise Exception(f"Image non trouvée: {image_path}")

       # Vérification : est-ce que le fichier est une image ?
       try:
           with Image.open(image_path) as img:
               img.verify()
           print("Le fichier est une image valide.")
       except Exception as e:
           print("Erreur : Le fichier n'est pas une image valide. Détails :", str(e))
           return jsonify({'error': 'Le fichier n\'est pas une image valide.'}), 400

       # Faire la prédiction
       preds = model_predict(image_path, model)
       print("Prédiction réussie.")

       # Classes de maladies
       disease_class = [
           'Pepper__bell___Bacterial_spot', 'Pepper__bell___healthy',
           'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
           'Tomato_Bacterial_spot', 'Tomato_Early_blight', 'Tomato_Late_blight',
           'Tomato_Leaf_Mold', 'Tomato_Septoria_leaf_spot',
           'Tomato_Spider_mites_Two_spotted_spider_mite', 'Tomato__Target_Spot',
           'Tomato__Tomato_YellowLeaf__Curl_Virus', 'Tomato__Tomato_mosaic_virus',
           'Tomato_healthy'
       ]

       # Interpréter les résultats
       predicted_class_index = np.argmax(preds[0])
       confidence = np.max(preds[0]) * 100
       predicted_class = disease_class[predicted_class_index]

       # Retourner les résultats
       return jsonify({
           'success': True,
           'data': {
               'disease': predicted_class,
               'confidence': round(confidence, 2)
           }
       })

   except Exception as e:
       print("Erreur:", str(e))
       return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
   app.run(host='0.0.0.0', port=5007)