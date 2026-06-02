import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import styles from './Agendamento.module.css';

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number | string;
  duracao_estimada: number;
}

interface Funcionario {
  id: number;
  nome: string;
  funcao: string;
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

export function Agendamento() {
  const [etapa, setEtapa] = useState(1);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Funcionario | null>(null);
  
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [clienteObs, setClienteObs] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/servicos').then(r => setServicos(r.data));
    api.get('/funcionarios').then(r => setFuncionarios(r.data));
  }, []);

  useEffect(() => {
    if (dataSelecionada && profissionalSelecionado) {
      setHorarioSelecionado('');
      api.get('/atendimentos').then(r => {
        const atendimentos: any[] = r.data;
        const dataFiltrada = atendimentos.filter(a => {
          if (!a.horario || a.funcionario_id !== profissionalSelecionado.id) return false;
          const aDate = new Date(a.horario);
          // Converter data para YYYY-MM-DD ignorando timezone
          const isoDate = aDate.toISOString().split('T')[0];
          return isoDate === dataSelecionada;
        });
        const ocupados = dataFiltrada.map(a => {
          const aDate = new Date(a.horario);
          return `${String(aDate.getUTCHours()).padStart(2, '0')}:${String(aDate.getUTCMinutes()).padStart(2, '0')}`;
        });
        setHorariosOcupados(ocupados);
      });
    }
  }, [dataSelecionada, profissionalSelecionado]);

  function getCategoria(nome: string) {
    const n = nome.toLowerCase();
    if (n.includes('corte') || n.includes('escova') || n.includes('coloração') || n.includes('hidratação')) return 'Cabelos';
    if (n.includes('limpeza') || n.includes('peeling') || n.includes('estética')) return 'Estética';
    if (n.includes('manicure') || n.includes('pedicure') || n.includes('unhas')) return 'Unhas';
    return 'Outros';
  }

  const servicosFiltrados = servicos.filter(s => {
    if (categoriaAtiva === 'Todos') return true;
    return getCategoria(s.nome) === categoriaAtiva;
  });

  const getHorariosGerados = () => {
    const horas = [];
    for (let h = 9; h <= 19; h++) {
      horas.push(`${String(h).padStart(2, '0')}:00`);
      if (h !== 19) horas.push(`${String(h).padStart(2, '0')}:30`);
    }
    return horas;
  };

  const getAvatarColorClass = (idx: number) => {
    const i = idx % 4;
    return styles[`avatar-${i}`];
  };

  async function confirmarAgendamento() {
    if (!clienteNome || !clienteTelefone) {
      alert("Preencha os dados obrigatórios.");
      return;
    }
    setSubmitting(true);
    try {
      const cRes = await api.post('/clientes', {
        nome: clienteNome,
        contato: clienteTelefone,
        descricao: clienteObs
      });
      const cliente_id = cRes.data.id;
      
      const dateTimeIso = `${dataSelecionada}T${horarioSelecionado}:00.000Z`;
      
      await api.post('/atendimentos', {
        funcionario_id: profissionalSelecionado!.id,
        cliente_id,
        servico_id: servicoSelecionado!.id,
        horario: dateTimeIso
      });
      
      setEtapa(5);
    } catch (err) {
      alert("Erro ao confirmar agendamento");
    } finally {
      setSubmitting(false);
    }
  }

  function renderStepClass(s: number) {
    if (etapa > s) return `${styles.step} ${styles.completed}`;
    if (etapa === s) return `${styles.step} ${styles.active}`;
    return styles.step;
  }

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className={`${styles['page-background']} page-bg-image`}>
      <div className={styles['agendamento-container']}>
        {/* Stepper */}
        <div className={styles.stepper}>
          <div className={renderStepClass(1)}>
            <div className={styles['step-number']}>1</div>
            <div className={styles['step-text']}>Serviço</div>
          </div>
          <div className={styles['step-separator']}></div>
          <div className={renderStepClass(2)}>
            <div className={styles['step-number']}>2</div>
            <div className={styles['step-text']}>Profissional</div>
          </div>
          <div className={styles['step-separator']}></div>
          <div className={renderStepClass(3)}>
            <div className={styles['step-number']}>3</div>
            <div className={styles['step-text']}>Data & Hora</div>
          </div>
          <div className={styles['step-separator']}></div>
          <div className={renderStepClass(4)}>
            <div className={styles['step-number']}>4</div>
            <div className={styles['step-text']}>Confirmação</div>
          </div>
        </div>

        <div className={styles['etapas-container']}>
          {/* Etapa 1: Serviço */}
          {etapa === 1 && (
            <div className={`${styles.etapa} ${styles.active}`}>
              <h2>Escolha o Serviço</h2>
              <div className={styles.filters}>
                {['Todos', 'Cabelos', 'Estética', 'Unhas', 'Outros'].map(cat => (
                  <button 
                    key={cat} 
                    className={`${styles['filter-btn']} ${categoriaAtiva === cat ? styles.active : ''}`}
                    onClick={() => setCategoriaAtiva(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className={styles['servicos-grid']}>
                {servicosFiltrados.map(s => {
                  const isSelected = servicoSelecionado?.id === s.id;
                  const notSelected = servicoSelecionado && !isSelected;
                  return (
                    <div 
                      key={s.id} 
                      className={`${styles['service-card']} ${isSelected ? styles.selectedCard : ''} ${notSelected ? styles.notSelectedCard : ''}`}
                      onClick={() => setServicoSelecionado(s)}
                    >
                      <div className={styles['card-icon-check']}>✓</div>
                      <h3>{s.nome}</h3>
                      <p>{s.descricao}</p>
                      <div className={styles['service-badges']}>
                        <span className={styles['badge-price']}>R$ {Number(s.preco).toFixed(2)}</span>
                        <span className={styles['badge-time']}>{formatDuracao(s.duracao_estimada)} min</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className={styles['botoes-navegacao']}>
                <div></div>
                <button 
                  className={styles['btn-primario']} 
                  disabled={!servicoSelecionado}
                  onClick={() => setEtapa(2)}
                >
                  Próximo &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Etapa 2: Profissional */}
          {etapa === 2 && (
            <div className={`${styles.etapa} ${styles.active}`}>
              <h2>Escolha o Profissional</h2>
              <div className={styles['profissionais-grid']}>
                {funcionarios.map((f, i) => {
                  const isSelected = profissionalSelecionado?.id === f.id;
                  const notSelected = profissionalSelecionado && !isSelected;
                  const inits = f.nome.substring(0,2).toUpperCase();
                  return (
                    <div 
                      key={f.id} 
                      className={`${styles['professional-card']} ${isSelected ? styles.selectedCard : ''} ${notSelected ? styles.notSelectedCard : ''}`}
                      onClick={() => setProfissionalSelecionado(f)}
                    >
                      <div className={styles['card-icon-check']}>✓</div>
                      <div className={`${styles.avatar} ${getAvatarColorClass(i)}`}>{inits}</div>
                      <h3>{f.nome}</h3>
                      <p>{f.funcao || 'Profissional'}</p>
                      <div className={styles['badge-available']}>Disponível</div>
                    </div>
                  )
                })}
              </div>
              
              <div className={styles['botoes-navegacao']}>
                <button className={styles['btn-secundario']} onClick={() => setEtapa(1)}>&larr; Voltar</button>
                <button 
                  className={styles['btn-primario']} 
                  disabled={!profissionalSelecionado}
                  onClick={() => setEtapa(3)}
                >
                  Próximo &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Etapa 3: Data e Horário */}
          {etapa === 3 && (
            <div className={`${styles.etapa} ${styles.active}`}>
              <h2>Escolha a Data e o Horário</h2>
              <div className={styles['data-hora-container']}>
                <div className={styles['data-section']}>
                  <label htmlFor="data-agendamento">Data:</label>
                  <input 
                    type="date" 
                    id="data-agendamento" 
                    className={styles['input-dark']}
                    min={minDate}
                    value={dataSelecionada}
                    onChange={e => setDataSelecionada(e.target.value)}
                  />
                </div>
                <div className={styles['horarios-section']}>
                  <label>Horários Disponíveis:</label>
                  <div className={styles['horarios-grid']}>
                    {!dataSelecionada && <p className={styles['placeholder-text']}>Selecione uma data primeiro.</p>}
                    {dataSelecionada && getHorariosGerados().map(h => {
                      const isOcupado = horariosOcupados.includes(h);
                      const isSelecionado = horarioSelecionado === h;
                      return (
                        <div 
                          key={h}
                          className={`${styles['chip-horario']} ${isOcupado ? styles.ocupado : ''} ${isSelecionado ? styles.selecionado : ''}`}
                          onClick={() => {
                            if (!isOcupado) setHorarioSelecionado(h);
                          }}
                        >
                          {h}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className={styles['botoes-navegacao']}>
                <button className={styles['btn-secundario']} onClick={() => setEtapa(2)}>&larr; Voltar</button>
                <button 
                  className={styles['btn-primario']} 
                  disabled={!dataSelecionada || !horarioSelecionado}
                  onClick={() => setEtapa(4)}
                >
                  Próximo &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Etapa 4: Confirmação */}
          {etapa === 4 && (
            <div className={`${styles.etapa} ${styles.active}`}>
              <h2>Confirmação</h2>
              <div className={styles['confirmacao-grid']}>
                <div className={styles['resumo-card']}>
                  <h3>Resumo do Agendamento</h3>
                  <p><strong>Serviço:</strong> {servicoSelecionado?.nome}</p>
                  <p><strong>Profissional:</strong> {profissionalSelecionado?.nome}</p>
                  <p><strong>Data:</strong> {dataSelecionada.split('-').reverse().join('/')}</p>
                  <p><strong>Horário:</strong> {horarioSelecionado}</p>
                  <p><strong>Preço:</strong> R$ {Number(servicoSelecionado?.preco).toFixed(2)}</p>
                  <p><strong>Duração:</strong> {formatDuracao(servicoSelecionado?.duracao_estimada)} min</p>
                </div>
                <div className={styles['dados-cliente-form']}>
                  <h3>Seus Dados</h3>
                  <div className={styles['input-group']}>
                    <input 
                      type="text" 
                      placeholder="Nome completo *" 
                      className={styles['input-dark']}
                      value={clienteNome}
                      onChange={e => setClienteNome(e.target.value)}
                    />
                  </div>
                  <div className={styles['input-group']}>
                    <input 
                      type="text" 
                      placeholder="Telefone/WhatsApp *" 
                      className={styles['input-dark']}
                      value={clienteTelefone}
                      onChange={e => setClienteTelefone(e.target.value)}
                    />
                  </div>
                  <div className={styles['input-group']}>
                    <input 
                      type="email" 
                      placeholder="E-mail" 
                      className={styles['input-dark']}
                      value={clienteEmail}
                      onChange={e => setClienteEmail(e.target.value)}
                    />
                  </div>
                  <div className={styles['input-group']}>
                    <textarea 
                      placeholder="Observações/Alergias" 
                      className={styles['input-dark']} 
                      rows={3}
                      value={clienteObs}
                      onChange={e => setClienteObs(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className={styles['botoes-navegacao']}>
                <button className={styles['btn-secundario']} onClick={() => setEtapa(3)}>&larr; Voltar</button>
                <button 
                  className={styles['btn-confirmar']}
                  onClick={confirmarAgendamento}
                  disabled={submitting}
                >
                  {submitting ? 'Confirmando...' : '✓ Confirmar Agendamento'}
                </button>
              </div>
            </div>
          )}

          {/* Tela de Sucesso */}
          {etapa === 5 && (
            <div className={`${styles.etapa} ${styles.active} ${styles['text-center']}`}>
              <h2 style={{ color: '#2ECC71' }}>Agendamento Confirmado!</h2>
              <div className={styles['linha-dourada']}></div>
              <p className={styles['sucesso-subtitulo']}>
                Seu agendamento para {servicoSelecionado?.nome} com {profissionalSelecionado?.nome} foi confirmado para {dataSelecionada.split('-').reverse().join('/')} às {horarioSelecionado}.
              </p>
              <Link to="/" className={`${styles['btn-primario']} ${styles['btn-home-link']}`}>Voltar para a Home</Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
