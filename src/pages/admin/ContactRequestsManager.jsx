import { useState, useEffect } from 'react';
import { getContactRequests, updateContactRequest, deleteContactRequest } from '../../api/contactRequests';
import { getCountryName } from '../../utils/countries';
import { normalizeText } from '../../utils/text';

const ContactRequestsManager = () => {
  const [contactRequests, setContactRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchContactRequests = async () => {
    try {
      const data = await getContactRequests();
      setContactRequests(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateContactRequest(id, { status: newStatus });
      fetchContactRequests();
    } catch (err) {
      alert('Error al cambiar el estado de la solicitud');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar esta solicitud de contacto? Esta acción no se puede deshacer.')) {
      try {
        await deleteContactRequest(id);
        fetchContactRequests();
      } catch (err) {
        alert('Error al eliminar la solicitud');
      }
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendiente',
      contacted: 'Contactado',
      in_progress: 'En progreso',
      shipped: 'Enviado',
      delivered: 'Entregado',
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return <p className="text-center py-10">Cargando solicitudes de contacto...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">Error al cargar las solicitudes de contacto</p>;
  }

  const countryOptions = contactRequests
    .map((request) => request.country)
    .filter(Boolean)
    .filter((code, index, self) => self.indexOf(code) === index)
    .map((code) => ({ code, name: getCountryName(code, 'es') }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));

  const q = normalizeText(searchTerm);
  const filteredRequests = contactRequests.filter((request) => {
    const matchesText =
      normalizeText(request.client_name || '').includes(q) ||
      normalizeText(request.email || '').includes(q) ||
      normalizeText(request.pet_name || '').includes(q);
    const matchesCountry = selectedCountry === '' || request.country === selectedCountry;
    const matchesStatus = selectedStatus === '' || request.status === selectedStatus;
    return matchesText && matchesCountry && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Gestión de Solicitudes de Contacto</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, email o mascota..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los países</option>
          {countryOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          aria-label="Filtrar por estado"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="contacted">Contactado</option>
          <option value="in_progress">En progreso</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregado</option>
        </select>
        {(searchTerm !== '' || selectedCountry !== '' || selectedStatus !== '') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCountry('');
              setSelectedStatus('');
            }}
            className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {contactRequests.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No hay solicitudes de contacto todavía</p>
        ) : filteredRequests.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No se encontraron resultados para los filtros aplicados</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mascota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  País
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.client_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{request.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{request.pet_name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{getCountryName(request.country, 'es')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="contacted">Contactado</option>
                      <option value="in_progress">En progreso</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(request.created_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Ver detalle
                    </button>
                    <button
                      onClick={() => handleDelete(request.id)}
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

      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Detalle de Solicitud</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Nombre del cliente:</span>
                  <p className="text-gray-700">{selectedRequest.client_name}</p>
                </div>

                <div>
                  <span className="font-semibold">Email:</span>
                  <p className="text-gray-700">{selectedRequest.email}</p>
                </div>

                <div>
                  <span className="font-semibold">WhatsApp:</span>
                  <p className="text-gray-700">{selectedRequest.whatsapp}</p>
                </div>

                <div>
                  <span className="font-semibold">País:</span>
                  <p className="text-gray-700">{getCountryName(selectedRequest.country, 'es')}</p>
                </div>

                <div>
                  <span className="font-semibold">Nombre de la mascota:</span>
                  <p className="text-gray-700">{selectedRequest.pet_name || '-'}</p>
                </div>

                <div>
                  <span className="font-semibold">Notas:</span>
                  <p className="text-gray-700">{selectedRequest.notes || '-'}</p>
                </div>

                {selectedRequest.pet_image_url && (
                  <div>
                    <span className="font-semibold">Foto de la mascota:</span>
                    <img
                      src={selectedRequest.pet_image_url}
                      alt="Foto de la mascota"
                      className="mt-2 max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                <div>
                  <span className="font-semibold">Recibir promociones:</span>
                  <p className="text-gray-700">{selectedRequest.wants_promotions ? 'Sí' : 'No'}</p>
                </div>

                <div>
                  <span className="font-semibold">Estado:</span>
                  <p className="text-gray-700">{getStatusLabel(selectedRequest.status)}</p>
                </div>

                <div>
                  <span className="font-semibold">Fecha de creación:</span>
                  <p className="text-gray-700">{formatDate(selectedRequest.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactRequestsManager;
