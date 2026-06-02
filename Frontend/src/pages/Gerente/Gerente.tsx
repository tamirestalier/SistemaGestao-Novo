import { useEffect, useState } from 'react';
import api from '../../api/axios';
import styles from './Gerente.module.css';

interface Resumo {
  totalClientes: number;
  totalFuncionarios: number;
  totalServicos: number;
  totalProdutos: number;
  totalVendas: number;
  totalAtendimentos: number;
}

// Icones SVG Premium
const IconClientes = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconFuncionarios = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="10" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
  </svg>
);

const IconServicos = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="9.8" y1="8.2" x2="22" y2="18.2" />
    <line x1="9.8" y1="15.8" x2="22" y2="5.8" />
  </svg>
);

const IconProdutos = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <polygon points="12 22.08 12 12 3 6.93 3 17.02 12 22.08" />
    <polygon points="12 22.08 12 12 21 6.93 21 17.02 12 22.08" />
    <polygon points="12 12 3 6.93 12 1.86 21 6.93 12 12" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconVendas = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconAtendimentos = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export function Gerente() {
  const [resumo, setResumo] = useState<Resumo>({
    totalClientes: 0,
    totalFuncionarios: 0,
    totalServicos: 0,
    totalProdutos: 0,
    totalVendas: 0,
    totalAtendimentos: 0,
  });

  useEffect(() => {
    async function carregarResumo() {
      try {
        const [clientes, funcionarios, servicos, produtos, vendas, atendimentos] =
          await Promise.allSettled([
            api.get('/clientes'),
            api.get('/funcionarios'),
            api.get('/servicos'),
            api.get('/produtos'),
            api.get('/vendas'),
            api.get('/atendimentos'),
          ]);

        setResumo({
          totalClientes:     clientes.status     === 'fulfilled' ? (clientes.value.data?.length     ?? 0) : 0,
          totalFuncionarios: funcionarios.status === 'fulfilled' ? (funcionarios.value.data?.length ?? 0) : 0,
          totalServicos:     servicos.status     === 'fulfilled' ? (servicos.value.data?.length     ?? 0) : 0,
          totalProdutos:     produtos.status     === 'fulfilled' ? (produtos.value.data?.length     ?? 0) : 0,
          totalVendas:       vendas.status       === 'fulfilled' ? (vendas.value.data?.length       ?? 0) : 0,
          totalAtendimentos: atendimentos.status === 'fulfilled' ? (atendimentos.value.data?.length ?? 0) : 0,
        });
      } catch (err) {
        console.error('Erro ao carregar resumo', err);
      }
    }
    carregarResumo();
  }, []);

  const cards = [
    { icon: <IconClientes />, label: 'Clientes',      valor: resumo.totalClientes,      cor: '#D4AF37', link: '/cadastro' },
    { icon: <IconFuncionarios />, label: 'Funcionários',  valor: resumo.totalFuncionarios,  cor: '#00c6ff', link: '/cadastro-funcionario' },
    { icon: <IconServicos />, label: 'Serviços',      valor: resumo.totalServicos,      cor: '#38bdf8', link: '/servicos' },
    { icon: <IconProdutos />, label: 'Produtos',      valor: resumo.totalProdutos,      cor: '#D4AF37', link: '/estoque' },
    { icon: <IconVendas />, label: 'Vendas',        valor: resumo.totalVendas,        cor: '#2ECC71', link: '#' },
    { icon: <IconAtendimentos />, label: 'Atendimentos',  valor: resumo.totalAtendimentos,  cor: '#00c6ff', link: '/agenda' },
  ];

  return (
    <main className={`${styles.main} page-bg-image`}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Painel do Gerente</h1>
        <p className={styles.subtitle}>Visão geral e controle completo do sistema</p>
        <div className={styles.line}></div>
      </section>

      <section className={styles.grid}>
        {cards.map((card) => (
          <a key={card.label} href={card.link} className={styles.card} style={{ '--card-cor': card.cor } as React.CSSProperties}>
            <div className={styles.cardIcon}>{card.icon}</div>
            <div className={styles.cardInfo}>
              <span className={styles.cardLabel}>{card.label}</span>
              <span className={styles.cardValor}>{card.valor}</span>
            </div>
            <div className={styles.cardGlow}></div>
          </a>
        ))}
      </section>

      <section className={styles.atalhos}>
        <h2 className={styles.atalhosTitulo}>Acesso Rápido</h2>
        <div className={styles.atalhoGrid}>
          <a href="/cadastro-funcionario" className={styles.atalho}>
            <IconFuncionarios size={18} />
            Cadastrar Funcionário
          </a>
          <a href="/estoque" className={styles.atalho}>
            <IconProdutos size={18} />
            Gerenciar Estoque
          </a>
          <a href="/agenda" className={styles.atalho}>
            <IconAtendimentos size={18} />
            Ver Agenda
          </a>
          <a href="/servicos" className={styles.atalho}>
            <IconServicos size={18} />
            Serviços
          </a>
        </div>
      </section>
    </main>
  );
}
