import { useState, useEffect } from 'react';
import { getArtworks, createArtwork, updateArtwork, deleteArtwork, uploadArtworkImage } from '../../api/artworks';
import { normalizeText } from '../../utils/text';

const ArtworksManager = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [artworkImageFile, setArtworkImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchArtworks = async () => {
    try {
      const data = await getArtworks();
      setArtworks(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  useEffect(() => {
    if (editingArtwork) {
      setFormData({
        title: editingArtwork.title,
        description: editingArtwork.description || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
      });
    }
  }, [editingArtwork]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArtworkImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let imageUrl = null;

      if (artworkImageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', artworkImageFile);
        const uploadResult = await uploadArtworkImage(uploadFormData);
        imageUrl = uploadResult.url;
      }

      if (editingArtwork === null) {
        if (!imageUrl) {
          setSubmitError('Debes seleccionar una imagen para crear un artwork');
          setIsSubmitting(false);
          return;
        }
        await createArtwork({
          title: formData.title,
          description: formData.description,
          image_url: imageUrl,
        });
      } else {
        const updateData = {
          title: formData.title,
          description: formData.description,
        };
        if (imageUrl) {
          updateData.image_url = imageUrl;
        }
        await updateArtwork(editingArtwork.id, updateData);
      }

      setFormData({ title: '', description: '' });
      setArtworkImageFile(null);
      setEditingArtwork(null);
      fetchArtworks();
    } catch (err) {
      setSubmitError('Error al guardar el artwork');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (artwork) => {
    setEditingArtwork(artwork);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que querés eliminar este artwork? Esta acción no se puede deshacer.')) {
      try {
        await deleteArtwork(id);
        fetchArtworks();
      } catch (err) {
        setError('Error al eliminar el artwork');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingArtwork(null);
    setFormData({ title: '', description: '' });
    setArtworkImageFile(null);
    setSubmitError(null);
  };

  if (loading) {
    return <p className="text-center py-10">Cargando artworks...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">Error al cargar los artworks</p>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Gestión de Artworks</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingArtwork ? 'Editar artwork' : 'Crear nuevo artwork'}
        </h2>

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Título *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-2">
              Imagen {editingArtwork ? '(opcional, dejar vacío para mantener la actual)' : '*'}
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              required={!editingArtwork}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {artworkImageFile && (
              <p className="mt-2 text-sm text-gray-600">{artworkImageFile.name}</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : editingArtwork ? 'Actualizar' : 'Crear'}
            </button>

            {editingArtwork && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por título..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {(() => {
          const filteredArtworks = artworks.filter((a) =>
            normalizeText(a.title).includes(normalizeText(searchTerm))
          );

          if (artworks.length === 0) {
            return <p className="text-center py-10 text-gray-500">No hay artworks todavía</p>;
          }

          if (filteredArtworks.length === 0) {
            return <p className="text-center py-10 text-gray-500">No se encontraron resultados para la búsqueda</p>;
          }

          return (
            <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArtworks.map((artwork) => (
                <tr key={artwork.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="h-16 w-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{artwork.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {artwork.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(artwork)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(artwork.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          );
        })()}
      </div>
    </div>
  );
};

export default ArtworksManager;
