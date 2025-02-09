# Utiliser une image Python Slim
FROM python:3.8-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copier le fichier de dépendances et installer les bibliothèques Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier les fichiers de l'application dans le conteneur
COPY . .

# Exposer le port utilisé par Flask
EXPOSE 5007

# Commande pour démarrer l'application Flask
CMD ["python", "app.py"]