import React, { useState, useEffect } from 'react';
import { Eye, Search, Upload, Sparkles } from 'lucide-react';
import ImageAnalysisModal from './ImageAnalysisModal';
import ImagePreviewModal from './ImagePreviewModal';
import UploadModal from './uploadModal';

export default function ImageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_FILE_SERVICE_URL}/images`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erreur lors du chargement des images');

      const data = await response.json();
      setImages(data.images);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newImage) => {
    setImages(prevImages => [...prevImages, newImage]);
  };

  // Gestionnaires de modal
  const openAnalysisModal = (e, image) => {
    e.stopPropagation();
    setSelectedImage(image);
    setIsAnalysisModalOpen(true);
  };

  const closeAnalysisModal = () => {
    setSelectedImage(null);
    setIsAnalysisModalOpen(false);
  };

  const openPreviewModal = (image) => {
    setSelectedImage(image);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setSelectedImage(null);
    setIsPreviewModalOpen(false);
  };

  // Filtrage des images basé sur la recherche
  const filteredImages = images.filter(image =>
    image.dataset_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec recherche */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h2 className="text-2xl font-bold text-green-800">Mes Images</h2>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            Ajouter une image
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="mt-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une image..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Grille d'images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
          >
            <div
              className="relative aspect-video cursor-pointer group"
              onClick={() => openPreviewModal(image)}
            >
              <img
                src={`${process.env.REACT_APP_FILE_SERVICE_URL}${image.file_path}`}
                alt={image.dataset_name || 'Image'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                <Eye className="text-white opacity-0 group-hover:opacity-100 transition-all duration-200 w-8 h-8" />
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">
                {image.dataset_name}
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(image.uploaded_at).toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => openAnalysisModal(e, image)}
                  className="flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Analyser
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">
            {searchTerm ? 'Aucune image ne correspond à votre recherche' : 'Aucune image disponible'}
          </p>
        </div>
      )}

      {/* Modals */}
      <ImageAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={closeAnalysisModal}
        selectedImage={selectedImage}
      />

      <ImagePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={closePreviewModal}
        image={selectedImage}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}