import { useState, useEffect } from 'react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../api/testimonials';
import { getArtworks } from '../../api/artworks';
import { normalizeText } from '../../utils/text';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [artworksList, setArtworksList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    client_name: '',
    content: '',
    artwork_id: '',
    visible: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonialsData, artworksData] = await Promise.all([
          getTestimonials(),
          getArtworks(),
        ]);
        setTestimonials(testimonialsData);
        setArtworksList(artworksData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (editingTestimonial) {
      setFormData({
        client_name: editingTestimonial.client_name,
        content: editingTestimonial.content,
        artwork_id: editingTestimonial.artwork_id ? String(editingTestimonial.artwork_id) : '',
        visible: editingTestimonial.visible,
      });
    } else {
      setFormData({
        client_name: '',
        content: '',
        artwork_id: '',
        visible: false,
      });
    }
  }, [editingTestimonial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const artworkIdToSend = formData.artwork_id === '' ? null : parseInt(formData.artwork_id);

      const data = {
        client_name: formData.client_name,
        content: formData.content,
        artwork_id: artworkIdToSend,
        visible: formData.visible,
      };

      if (editingTestimonial === null) {
        await createTestimonial(data);
      } else {
        await updateTestimonial(editingTestimonial.id, data);
      }

      setFormData({
        client_name: '',
        content: '',
        artwork_id: '',
        visible: false,
      });
      setEditingTestimonial(null);
      fetchTestimonials();
    } catch (err) {
      setSubmitError('Error al guardar el testimonio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este testimonio? Esta acción no se puede deshacer.')) {
      try {
        await deleteTestimonial(id);
        fetchTestimonials();
      } catch (err) {
        alert('Error al eliminar el testimonio');
      }
    }
  };

  const handleVisibilityChange = async (testimonial) => {
    try {
      const updatedTestimonial = await updateTestimonial(testimonial.id, { visible: !testimonial.visible });
      setTestimonials((currentTestimonials) => currentTestimonials.map((currentTestimonial) => (
        currentTestimonial.id === updatedTestimonial.id ? updatedTestimonial : currentTestimonial
      )));
    } catch (err) {
      alert('Error al cambiar la visibilidad del testimonio');
    }
  };

  const handleCancelEdit = () => {
    setEditingTestimonial(null);
    setFormData({
      client_name: '',
      content: '',
      artwork_id: '',
      visible: false,
    });
    setSubmitError(null);
  };

  const getArtworkTitle = (artworkId) => {
    if (!artworkId) return 'Sin artwork asociado';
    const artwork = artworksList.find((a) => a.id === artworkId);
    return artwork ? artwork.title : 'Artwork no encontrado';
  };

  if (loading) {
    return <p className="text-center py-10">Cargando testimonios...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">Error al cargar los testimonios</p>;
  }

  const q = normalizeText(searchTerm);
  const filteredTestimonials = testimonials.filter((testimonial) => {
    const clientName = normalizeText(testimonial.client_name || '');
    const content = normalizeText(testimonial.content || '');
    return clientName.includes(q) || content.includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Gestión de Testimonials</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingTestimonial ? 'Editar testimonio' : 'Crear nuevo testimonio'}
        </h2>

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="client_name" className="block text-sm font-medium mb-2">
              Nombre del cliente *
            </label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Contenido *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="artwork_id" className="block text-sm font-medium mb-2">
              Artwork asociado (opcional)
            </label>
            <select
              id="artwork_id"
              name="artwork_id"
              value={formData.artwork_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sin artwork asociado</option>
              {artworksList.map((artwork) => (
                <option key={artwork.id} value={artwork.id}>
                  {artwork.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="visible"
              name="visible"
              checked={formData.visible}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="visible" className="ml-2 text-sm">
              Visible en el sitio público
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : editingTestimonial ? 'Actualizar' : 'Crear'}
            </button>

            {editingTestimonial && (
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
          placeholder="Buscar por cliente o contenido..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {testimonials.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No hay testimonios todavía</p>
        ) : filteredTestimonials.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No se encontraron resultados para la búsqueda</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contenido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artwork
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visible
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTestimonials.map((testimonial) => (
                <tr key={testimonial.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{testimonial.client_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {testimonial.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {getArtworkTitle(testimonial.artwork_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={testimonial.visible}
                      onChange={() => handleVisibilityChange(testimonial)}
                      aria-label={`Mostrar el testimonio de ${testimonial.client_name} en el sitio público`}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TestimonialsManager;
