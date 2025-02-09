FROM python:3.8-slim

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances système requises
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copier le fichier des dépendances et les installer
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source dans le conteneur
COPY . .

# Définir les volumes pour les images et les fichiers traités
VOLUME ["/data/images", "/app/processed"]

# Exposer le port utilisé par l'API
EXPOSE 5001

# Lancer le service
CMD ["python", "app.py"]
