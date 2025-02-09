
# DeepForest Docker Service

Service de détection d'arbres utilisant DeepForest et Flask.

## Installation

```bash
cd docker-deepforest
```

Construisez l'image Docker :

```bash
docker build -t deepforest:1.0.0 . ( it takes time !)
```

## Exécution : ( en powershell )

```powershell
# Mode détaché
docker run -d -p 5003:5003 -v [AGRO_STORAGE_PATH]:/data/images -v [PROCESSED_PATH]:/app/processed --name deepforest-detector deepforest:1.0.0
```

Exemple:

```plaintext
[AGRO_STORAGE_PATH] = C:\AgroStorage
[PROCESSED_PATH] = C:\Users\[USER]\Desktop\AgroAI\test-docker-deepforest\processed
```

Mode interactif ( is better so you can see the logs at the same time )

```powershell
docker run -it -p 5003:5003 -v [AGRO_STORAGE_PATH]:/data/images -v [PROCESSED_PATH]:/app/processed --name deepforest-detector deepforest:1.0.0
```

Exemple:

```plaintext
[AGRO_STORAGE_PATH] = C:\AgroStorage
[PROCESSED_PATH] = C:\Users\[USER]\Desktop\AgroAI\test-docker-deepforest\processed
```
