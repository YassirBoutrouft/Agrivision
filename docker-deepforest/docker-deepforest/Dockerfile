FROM python:3.8-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir deepforest flask flask-cors
ENV NO_ALBUMENTATIONS_UPDATE=1
COPY app.py .
VOLUME ["/data/images", "/app/processed"]
CMD ["python", "app.py"]
