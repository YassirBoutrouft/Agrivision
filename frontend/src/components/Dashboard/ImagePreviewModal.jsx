import React from 'react';
import Modal from 'react-modal';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { X, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

export default function ImagePreviewModal({ isOpen, onClose, image }) {
  if (!image) return null;

  // Détermine l'URL de l'image en fonction de sa source
  const imageUrl = image.file_path.startsWith('http') 
    ? image.file_path 
    : `${process.env.REACT_APP_FILE_SERVICE_URL}${image.file_path}`;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-xl max-w-7xl mx-auto mt-10 p-6 h-[80vh] overflow-hidden"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Aperçu de l'image</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image avec zoom */}
        <div className="flex-1 p-6">
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden h-full">
                  <TransformComponent>
                    <img
                      src={imageUrl}
                      alt="Aperçu"
                      className="object-contain w-full h-full"
                    />
                  </TransformComponent>
                </div>
                <div className="flex justify-center mt-4 space-x-4">
                  <button
                    onClick={zoomIn}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={zoomOut}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button
                    onClick={resetTransform}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </TransformWrapper>
        </div>
      </div>
    </Modal>
  );
}