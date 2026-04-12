import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, DollarSign, Clock, CheckCircle, ArrowLeft, User } from 'lucide-react';

const ProjectOffers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiFetch } = useAuth();
  
  const [project, setProject] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await apiFetch(`/projects/${id}`);
        setProject(projectData);
        
        const offersData = await apiFetch(`/projects/${id}/offers`);
        setOffers(offersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, apiFetch]);

  const handleHire = async (offer) => {
    if (!window.confirm(`Вы уверены, что хотите нанять ${offer.freelancer.name} за ${offer.price} ₽?`)) return;

    try {
      const deal = await apiFetch('/deals', {
        method: 'POST',
        body: JSON.stringify({
          projectId: project.id,
          freelancerId: offer.freelancerId,
          offerId: offer.id,
          amount: offer.price
        })
      });
      // Redirect to the new deal page
      navigate(`/order/${deal.id}`);
    } catch (err) {
      alert('Ошибка при создании сделки: ' + err.message);
    }
  };

  if (loading) return <div className="container loading-page">Загрузка откликов...</div>;
  if (error) return <div className="container error-page">{error}</div>;

  return (
    <div className="project-offers-page container">
      <Link to="/dashboard" className="back-link"><ArrowLeft size={16} /> Назад в кабинет</Link>
      
      <header className="offers-header">
        <div className="project-brief glass">
            <span className="badge">{project.category}</span>
            <h1>{project.title}</h1>
            <div className="project-meta-row">
                <span><DollarSign size={14}/> Бюджет: {project.budget} ₽</span>
                <span><Clock size={14}/> Создан: {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
      </header>

      <section className="offers-list-section">
        <h2>Отклики исполнителей ({offers.length})</h2>
        
        <div className="offers-grid">
          {offers.length > 0 ? (
            offers.map(offer => (
              <div key={offer.id} className="offer-card glass">
                <div className="offer-user-info">
                  <div className="offer-avatar">
                    {offer.freelancer.avatar.length > 4 ? (
                      <img src={offer.freelancer.avatar} alt="" />
                    ) : (
                      <span>{offer.freelancer.avatar}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="freelancer-name">{offer.freelancer.name}</h4>
                    <span className="freelancer-spec">{offer.freelancer.specialization || 'Фрилансер'}</span>
                  </div>
                </div>

                <div className="offer-body">
                  <p className="offer-message">{offer.message}</p>
                  <div className="offer-price-tag">Предложение: <strong>{offer.price} ₽</strong></div>
                </div>

                <div className="offer-footer">
                  <button className="btn-secondary"><MessageSquare size={16} /> Написать</button>
                  <button className="btn-primary" onClick={() => handleHire(offer)}>
                    <CheckCircle size={16} /> Нанять исполнителя
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-offers glass">
              <p>На данный проект пока нет откликов. Они появятся здесь, как только фрилансеры увидят ваш заказ на бирже.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProjectOffers;
