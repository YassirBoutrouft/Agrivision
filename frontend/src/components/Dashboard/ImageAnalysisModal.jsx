import React, { useState } from 'react';
import Modal from 'react-modal';
import { X, Loader, ZoomIn } from 'lucide-react';
import ImagePreviewModal from './ImagePreviewModal';

const AI_MODELS = [
{
  id: 'blur',
  name: 'Flou Gaussien',
  description: "Appliquer un effet de flou sur l'image",
  endpoint: 'http://localhost:5008/api/blur',
  type: 'detection'
},
{
  id: "disease-detection",
  name: "Détection des maladies",
  description: "Identifier les maladies sur les feuilles des plantes.",
  endpoint: "http://localhost:5007/api/disease-detection",
  type: 'analysis'
},
{
  id: "fruit-quality",
  name: "Classification et Qualité des Fruits",
  description: "Analyser et classifier les fruits tout en vérifiant leur qualité.",
  endpoint: "http://localhost:5000/api/predict",
  type: 'analysis'
},
{
  id: 'ndvi',
  name: 'Carte NDVI',
  description: "Analyser les besoins en irrigation à l'aide de l'indice NDVI",
  endpoint: 'http://localhost:5001/api/ndvi',
  type: 'analysis'
},
{
  id: 'edge-detection',
  name: 'Détection des contours',
  description: 'Détecter les contours de l\'image',
  endpoint: 'http://localhost:5004/api/edge-detection',
  type: 'detection'
},
{
  id: 'tree-detection',
  name: 'Détection des Arbres',
  description: 'Détecter et compter les arbres',
  endpoint: 'http://localhost:5003/api/analyze-trees',
  type: 'detection'
}
];

const ResultDisplay = ({ model, result, processedImage, onImageClick }) => {
// Pour les modèles qui retournent uniquement des données textuelles
if (model.id === 'disease-detection' || model.id === 'fruit-quality') {
  return (
    <div className="bg-white rounded-lg p-6 h-full">
      <div className="flex flex-col h-full justify-center">
        <h3 className="text-xl font-semibold text-green-700 mb-4">Résultats de l'analyse</h3>
        {model.id === 'disease-detection' && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-lg font-medium">Maladie détectée :</p>
              <p className="text-2xl text-green-700">{result.data.disease}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-lg font-medium">Niveau de confiance :</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 rounded-full h-4"
                    style={{ width: `${result.data.confidence}%` }}
                  ></div>
                </div>
                <span className="text-lg font-semibold">{result.data.confidence}%</span>
              </div>
            </div>
          </div>
        )}
        {model.id === 'fruit-quality' && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-lg font-medium">Type de fruit :</p>
              <p className="text-2xl text-green-700">{result.data.fruit}</p>
            </div>
            <div className="space-y-2">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-lg font-medium">Fraîcheur :</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-600 rounded-full h-4"
                      style={{ width: `${result.data.freshness}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-semibold">{result.data.freshness}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Pour tree-detection, afficher l'image ET le nombre d'arbres
if (model.id === 'tree-detection') {
  return (
    <div className="space-y-4">
      <div 
        className="relative aspect-video bg-white rounded-lg overflow-hidden group cursor-pointer"
        onClick={() => onImageClick(processedImage)}
      >
        <img
          src={processedImage}
          alt="Résultat"
          className="object-contain w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-opacity">
          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="text-lg font-semibold text-green-700 mb-2">Résultats</h3>
        <p>Nombre d'arbres détectés : {result.tree_count}</p>
      </div>
    </div>
  );
}

// Pour les autres modèles qui retournent une image
return (
  <div 
    className="relative aspect-video bg-white rounded-lg overflow-hidden group cursor-pointer"
    onClick={() => onImageClick(processedImage)}
  >
    <img
      src={processedImage}
      alt="Résultat"
      className="object-contain w-full h-full"
    />
    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-opacity">
      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </div>
);
};

export default function ImageAnalysisModal({ isOpen, onClose, selectedImage }) {
const [processedImageUrl, setProcessedImageUrl] = useState(null);
const [processing, setProcessing] = useState(false);
const [error, setError] = useState(null);
const [selectedModel, setSelectedModel] = useState(null);
const [previewImage, setPreviewImage] = useState(null);
const [selectedType, setSelectedType] = useState('analysis');
const [analysisResults, setAnalysisResults] = useState(null);

const filteredModels = AI_MODELS.filter(model => model.type === selectedType);

const handleModelSelect = async (model) => {
  if (!selectedImage) {
    setError("Aucune image sélectionnée.");
    return;
  }

  setProcessedImageUrl(null);
  setAnalysisResults(null);
  setProcessing(true);
  setError(null);
  setSelectedModel(model);

  try {
    const fullImagePath = `${process.env.REACT_APP_FILE_SERVICE_URL}${selectedImage.file_path}`;

    const response = await fetch(model.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePath: fullImagePath }),
    });

    if (!response.ok) throw new Error('Erreur lors du traitement de l\'image');

    const result = await response.json();
    setProcessedImageUrl(result.processedImageUrl);
    setAnalysisResults(result);

  } catch (err) {
    setError(err.message);
    setProcessedImageUrl(null);
    setAnalysisResults(null);
  } finally {
    setProcessing(false);
  }
};

const handleClose = () => {
  setProcessedImageUrl(null);
  setError(null);
  setSelectedModel(null);
  setPreviewImage(null);
  setAnalysisResults(null);
  onClose();
};

const handleOriginalImageClick = () => {
  setPreviewImage(selectedImage);
};

const handleProcessedImageClick = (imageUrl) => {
  if (imageUrl) {
    setPreviewImage({
      file_path: imageUrl.replace(process.env.REACT_APP_FILE_SERVICE_URL, '')
    });
  }
};

return (
  <>
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="bg-white rounded-xl max-w-7xl mx-auto mt-10 p-0 h-[80vh] overflow-hidden"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Analyse d'Image avec IA</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
            <div className="mb-4">
              <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                <button
                  onClick={() => setSelectedType('analysis')}
                  className={`px-3 py-1 rounded-md transition ${
                    selectedType === 'analysis'
                      ? 'bg-green-100 text-green-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Analysis
                </button>
                <button
                  onClick={() => setSelectedType('detection')}
                  className={`px-3 py-1 rounded-md transition ${
                    selectedType === 'detection'
                      ? 'bg-green-100 text-green-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Detection
                </button>
              </div>
            </div>

            <h3 className="font-medium text-gray-700 mb-4">Modèles disponibles</h3>
            <div className="space-y-2">
              {filteredModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model)}
                  disabled={processing}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    selectedModel?.id === model.id
                      ? 'bg-green-100 text-green-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm text-gray-500">{model.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-6 h-full">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Image originale</h4>
                {selectedImage?.file_path ? (
                  <div className="cursor-pointer" onClick={handleOriginalImageClick}>
                    <div className="relative aspect-video bg-white rounded-lg overflow-hidden group">
                      <img
                        src={`${process.env.REACT_APP_FILE_SERVICE_URL}${selectedImage.file_path}`}
                        alt="Original"
                        className="object-contain w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-opacity">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Chargement de l'image...
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Résultat</h4>
                {processing ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader className="w-8 h-8 animate-spin text-green-600 mx-auto" />
                  </div>
                ) : analysisResults ? (
                  <ResultDisplay
                    model={selectedModel}
                    result={analysisResults}
                    processedImage={processedImageUrl}
                    onImageClick={handleProcessedImageClick}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Aucun résultat disponible
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>

    <ImagePreviewModal
      isOpen={previewImage !== null}
      onClose={() => setPreviewImage(null)}
      image={previewImage}
    />
  </>
);
}