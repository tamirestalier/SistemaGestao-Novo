import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import styles from './Agenda.module.css';

interface Funcionario {
  id: number;
  nome: string;
}

interface Atendimento {
  id: number;
  horario: string;
  funcionario: Funcionario;
  cliente: { nome: string };
  servico: { nome: string };
}

export function Agenda() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [filtroProfissional, setFiltroProfissional] = useState('todos');

  useEffect(() => {
    async function load() {
      try {
        const resA = await api.get('/atendimentos');
        const resF = await api.get('/funcionarios');
        setAtendimentos(resA.data);
        setFuncionarios(resF.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const horarios = [];
  for (let h = 9; h <= 19; h++) {
    horarios.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 19) horarios.push(`${String(h).padStart(2, '0')}:30`);
  }

  // Estatísticas
  const atendimentosFiltrados = atendimentos.filter(a => 
    filtroProfissional === 'todos' || a.funcionario.nome === filtroProfissional
  );

  const hoje = new Date().toISOString().split('T')[0];
  const countHoje = atendimentosFiltrados.filter(a => {
    if (!a.horario) return false;
    return a.horario.startsWith(hoje);
  }).length;

  // Render grid
  return (
    <div className={`${styles.body1} page-bg-image`}>
      <div className={styles['agenda-container']}>
        <div className={styles['agenda-header-section']}>
          <div className={styles['header-left']}>
            <h1>Agenda Semanal</h1>
            <p className={styles.subtitle}>Sebastian Cabelo e Estética &mdash; Área Profissional</p>
          </div>
          <div className={styles['header-right']}>
            <div className={styles['badge-count']}>
              <span>{atendimentosFiltrados.length}</span> agendamentos
            </div>
            <div className={styles['filter-group']}>
              <label>Filtrar por Profissional: </label>
              <select 
                value={filtroProfissional} 
                onChange={e => setFiltroProfissional(e.target.value)}
              >
                <option value="todos">Todos</option>
                {funcionarios.map(f => (
                  <option key={f.id} value={f.nome}>{f.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles['legenda-profissionais']}>
          <div className={styles['legenda-item']}><span className={`${styles['legenda-cor']} ${styles['color-joao']}`}></span>João</div>
          <div className={styles['legenda-item']}><span className={`${styles['legenda-cor']} ${styles['color-maria']}`}></span>Maria</div>
          <div className={styles['legenda-item']}><span className={`${styles['legenda-cor']} ${styles['color-carlos']}`}></span>Carlos</div>
          <div className={styles['legenda-item']}><span className={`${styles['legenda-cor']} ${styles['color-ana']}`}></span>Ana</div>
        </div>

        <div className={styles['stats-bar']}>
          <div className={styles['stat-card']}>
            <span className={styles['stat-icon']}>📋</span>
            <span className={styles['stat-value']}>{atendimentosFiltrados.length}</span>
            <span className={styles['stat-label']}>Total</span>
          </div>
          <div className={styles['stat-card']}>
            <span className={styles['stat-icon']}>📅</span>
            <span className={styles['stat-value']}>{countHoje}</span>
            <span className={styles['stat-label']}>Hoje</span>
          </div>
        </div>

        <div className={styles['agenda-wrapper']}>
          <div className={styles['agenda-grid']}>
            {/* Corner Cell */}
            <div className={styles['grid-header']}>Hora</div>
            {/* Days headers */}
            {diasSemana.map(d => (
              <div key={d} className={styles['grid-header']}>{d}</div>
            ))}
            
            {/* Rows by Time */}
            {horarios.map(hora => (
              <React.Fragment key={hora}>
                <div className={styles['time-label']}>{hora}</div>
                {diasSemana.map((dia, dIdx) => {
                  // Mocks para alinhar com o protótipo: o protótipo provavelmente não atava à data real
                  // Aqui filtramos pelo horário correspondente (a.horario.includes(hora))
                  // Isso é uma aproximação para a demo do grid.
                  const cellAtends = atendimentosFiltrados.filter(a => {
                     if (!a.horario) return false;
                     // a.horario vem como "2026-06-01T09:00:00.000Z" (UTC). Precisamos bater com hora.
                     const aDate = new Date(a.horario);
                     const h = String(aDate.getUTCHours()).padStart(2, '0') + ':' + String(aDate.getUTCMinutes()).padStart(2, '0');
                     // E bater com o dia da semana (seg=1, sab=6)
                     const aDay = aDate.getUTCDay(); // domingo=0, seg=1, ... sab=6
                     const mappedDay = aDay === 0 ? 0 : aDay - 1; // nosso array: 0=Seg, 5=Sab
                     return h === hora && mappedDay === dIdx;
                  });

                  return (
                    <div key={`${hora}-${dia}`} className={styles['grid-cell']}>
                      {cellAtends.map(a => {
                         const profName = a.funcionario?.nome || '';
                         const colorClass = styles[`Appointment-${profName}`] || '';
                         return (
                           <div key={a.id} className={`${styles['appointment-card']} ${colorClass}`}>
                             <span className={styles['time-slot']}>{hora}</span>
                             <strong>{profName}</strong>
                             <span className={styles['client-name']}>{a.cliente?.nome}</span>
                             <span className={styles['service-name']}>{a.servico?.nome}</span>
                           </div>
                         );
                      })}
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
