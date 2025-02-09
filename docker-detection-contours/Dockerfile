FROM python:3.8-slim
WORKDIR /app

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
   libgl1-mesa-glx \
   libglib2.0-0 \
   && rm -rf /var/lib/apt/lists/*

# Installer les dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY . .

# Définir les volumes
VOLUME ["/data/images", "/app/processed"]

# Exposer le port
EXPOSE 5004

# Démarrer l'application
CMD ["python", "app.py"]