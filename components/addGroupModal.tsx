import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { NewGroupResponse } from '../types';

// Propiedades que el modal recibe de App.tsx
interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupAdded: (group: NewGroupResponse) => void;
  fetchGroupDetails: (groupName: string) => Promise<NewGroupResponse | null>;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ isOpen, onClose, onGroupAdded, fetchGroupDetails }) => {
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!groupName.trim()) {
      setError('Por favor, ingresa un nombre de grupo.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const details = await fetchGroupDetails(groupName.trim());
      
      if (details) {
        onGroupAdded(details);
        setGroupName(''); // Limpiar el input
        onClose(); // Cerrar el modal
      } else {
        setError('No se pudieron obtener los detalles del grupo.');
      }
    } catch (err) {
      console.error('Error al buscar grupo:', err);
      setError('Ocurrió un error al conectar con el servicio.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100"
        onClick={e => e.stopPropagation()} // Evita que el clic dentro cierre el modal
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Añadir Nuevo Grupo K-Pop</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition duration-150"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Ingresa el nombre del grupo K-Pop que deseas añadir. La IA buscará sus detalles oficiales.
        </p>

        <div className="mb-4">
          <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre del Grupo
          </label>
          <div className="relative">
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ej: Blackpink, BTS, TWICE..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 disabled:opacity-50"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50 flex items-center justify-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Buscando...</span>
              </>
            ) : (
              <span>Añadir Grupo</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGroupModal;
