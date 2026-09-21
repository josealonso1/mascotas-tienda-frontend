import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getContactRequests } from '../../api/contactRequests';
import { getArtworks } from '../../api/artworks';
import { getTestimonials } from '../../api/testimonials';

const Dashboard = () => {
  const [contactRequests, setContactRequests] = useState([]);
  const [artworksCount, setArtworksCount] = useState(0);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactRequestsData, artworksData, testimonialsData] = await Promise.all([
          getContactRequests(),
          getArtworks(),
          getTestimonials(),
        ]);
        setContactRequests(contactRequestsData);
        setArtworksCount(artworksData.length);
        setTestimonialsCount(testimonialsData.length);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingRequests = contactRequests.filter((cr) => cr.status === 'pending');
  const pendingCount = pendingRequests.length;

  if (loading) {
    return <p className="text-center py-10">Cargando dashboard...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">No se pudieron cargar los datos del panel</p>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Panel de administración</h1>

      {pendingCount > 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <p className="text-lg font-semibold text-yellow-800 mb-2">
            {pendingCount === 1
              ? 'Tienes 1 solicitud de contacto pendiente'
              : `Tienes ${pendingCount} solicitudes de contacto pendientes`}
          </p>
          <Link
            to="/admin/contact-requests"
            className="inline-block mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
          >
            Ver solicitudes
          </Link>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <p className="text-lg text-gray-700">No hay solicitudes pendientes</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-2">Total de Artworks</p>
          <p className="text-4xl font-bold text-gray-900">{artworksCount}</p>
          <Link
            to="/admin/artworks"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800"
          >
            Gestionar artworks
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-2">Total de Testimonials</p>
          <p className="text-4xl font-bold text-gray-900">{testimonialsCount}</p>
          <Link
            to="/admin/testimonials"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800"
          >
            Gestionar testimonials
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-2">Total de Solicitudes de Contacto</p>
          <p className="text-4xl font-bold text-gray-900">{contactRequests.length}</p>
          <Link
            to="/admin/contact-requests"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800"
          >
            Gestionar solicitudes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
