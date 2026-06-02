import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from './Servicos.module.css';

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: string | number;
  duracao_estimada: number;
}

function formatDuracao(duracao: any): string {
  if (!duracao) return '0';
  if (typeof duracao === 'number') return String(duracao);
  if (typeof duracao === 'string') {
    if (duracao.includes('T')) {
      const timePart = duracao.split('T')[1];
      const [h, m] = timePart.split(':');
      const totalMinutes = parseInt(h, 10) * 60 + parseInt(m, 10);
      return String(totalMinutes);
    }
    if (duracao.includes(':')) {
      const [h, m] = duracao.split(':');
      const totalMinutes = parseInt(h, 10) * 60 + parseInt(m, 10);
      return String(totalMinutes);
    }
  }
  return String(duracao);
}

export function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/servicos');
        setServicos(data);
      } catch (err) {
        setErro('Erro ao carregar serviços.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function getCategoria(nome: string) {
    const n = nome.toLowerCase();
    if (n.includes('corte') || n.includes('escova') || n.includes('coloração') || n.includes('coloracao') || n.includes('hidratação') || n.includes('hidratacao')) return 'Cabelos';
    if (n.includes('limpeza') || n.includes('peeling') || n.includes('estética') || n.includes('estetica')) return 'Estética';
    if (n.includes('manicure') || n.includes('pedicure') || n.includes('unhas')) return 'Unhas';
    return 'Outros';
  }

  const servicosFiltrados = servicos.filter(s => {
    if (categoriaAtiva === 'todos') return true;
    return getCategoria(s.nome) === categoriaAtiva;
  });

  return (
    <div className={`${styles.body1} page-bg-image`}>
      <div className={styles['services-container']}>
        
        <section className="promos-section">
          <h2>Kits e Promoções da Semana</h2>
          <div className={styles['promos-grid']}>
            <div className={styles['promo-card']}>
              <div className={styles['promo-title']}>Kit Transformação</div>
              <div className={styles['promo-desc']}>Corte + Coloração + Hidratação</div>
              <div className={styles['promo-price']}>R$ 180,00</div>
              <div className={styles['promo-conditions']}>Válido até sexta-feira</div>
            </div>
            <div className={styles['promo-card']}>
              <div className={styles['promo-title']}>Kit Noiva</div>
              <div className={styles['promo-desc']}>Penteado + Maquiagem + Manicure</div>
              <div className={styles['promo-price']}>R$ 250,00</div>
              <div className={styles['promo-conditions']}>Mediante agendamento prévio</div>
            </div>
          </div>
        </section>

        <section className="services-section">
          <div className={styles['services-header']}>
            <h2>Nossos Serviços</h2>
            <div className={styles['category-filters']}>
              {['todos', 'Cabelos', 'Estética', 'Unhas', 'Outros'].map(cat => (
                <button 
                  key={cat} 
                  className={`${styles['filter-btn']} ${categoriaAtiva === cat ? styles.active : ''}`}
                  onClick={() => setCategoriaAtiva(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading && <p>Carregando...</p>}
          {erro && <p style={{ color: 'var(--danger)' }}>{erro}</p>}

          <div className={styles['services-grid']}>
            {servicosFiltrados.map(s => (
              <div key={s.id} className={styles['service-card']}>
                <div className={styles['service-title']}>{s.nome}</div>
                <div className={styles['service-desc']}>{s.descricao}</div>
                <div className={styles['service-meta']}>
                  <span className={styles['price-badge']}>R$ {Number(s.preco).toFixed(2)}</span>
                  <span className={styles['time-badge']}>{formatDuracao(s.duracao_estimada)} min</span>
                </div>
                <button 
                  className={styles['btn-agendar']}
                  onClick={() => navigate('/agendamento')}
                >
                  Agendar
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
