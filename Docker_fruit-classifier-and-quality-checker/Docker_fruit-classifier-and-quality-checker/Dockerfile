# Utiliser une image de base Python légère
FROM python:3.8-slim

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Installer les bibliothèques Python requises
RUN pip install --no-cache-dir tensorflow flask flask-cors Pillow opencv-python-headless

# Copier tous les fichiers du dossier local dans le conteneur
COPY . .

# Définir des volumes pour les images et les fichiers traités
VOLUME ["/data/images", "/app/uploads"]

# Lancer le service avec app.py
CMD ["python", "app.py"]
