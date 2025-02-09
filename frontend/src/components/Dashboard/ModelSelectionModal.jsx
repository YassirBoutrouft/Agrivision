import React from 'react';
import Modal from 'react-modal';

export default function ModelSelectionModal({ isOpen, onRequestClose, selectedImage }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Sélection du modèle IA"
      className="bg-white rounded-lg shadow-md max-w-lg mx-auto p-6 mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h3 className="text-xl font-semibold mb-4">Choisir un modèle IA</h3>
      <p className="mb-6">Image sélectionnée : {selectedImage?.dataset_name}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            🌀 {/* Icône du modèle */}
          </div>
          <p className="mt-2 text-center text-sm">Modèle Blur</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            🎨 {/* Icône du modèle */}
          </div>
          <p className="mt-2 text-center text-sm">Modèle Colorisation</p>
        </div>
        {/* Ajouter plus de modèles ici */}
      </div>
      <button
        onClick={onRequestClose}
        className="bg-red-600 text-white px-4 py-2 rounded-lg mt-6 hover:bg-red-700 transition-colors"
      >
        Fermer
      </button>
    </Modal>
  );
}
