import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isGerente, logout, user } = useAuth();
  const navigate  = useNavigate();
  const listRef   = useRef<HTMLUListElement>(null);

  // Animar itens do menu mobile (equivalente ao mobile-navbar.js original)
  useEffect(() => {
    const items = listRef.current?.querySelectorAll('li');
    items?.forEach((li, i) => {
      if (menuOpen) {
        (li as HTMLElement).style.animation =
          `navLinkFade 0.5s ease forwards ${i / 7 + 0.3}s`;
      } else {
        (li as HTMLElement).style.animation = '';
        (li as HTMLElement).style.opacity   = '0';
      }
    });
  }, [menuOpen]);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  function close() { setMenuOpen(false); }

  function handleLogout() {
    logout();
    navigate('/login');
    close();
  }

  return (
    <nav>
      <Link to="/" className="logo" onClick={close}>
        Sebastian Cabelo e Estética
      </Link>

      <div
        className={`mobile-menu ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="line1" />
        <div className="line2" />
        <div className="line3" />
      </div>

      <ul ref={listRef} className={`nav-list ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/"           onClick={close}>Home</Link></li>
        <li><Link to="/servicos"   onClick={close}>Serviços</Link></li>
        <li><Link to="/agendamento" onClick={close}>Agendamento</Link></li>

        {isAuthenticated && (
          <li><Link to="/agenda"             onClick={close}>Agenda</Link></li>
        )}
        {isAuthenticated && (
          <li><Link to="/historico-cliente"  onClick={close}>Histórico</Link></li>
        )}
        {isGerente && (
          <li><Link to="/estoque"            onClick={close}>Estoque</Link></li>
        )}
        {isGerente && (
          <li><Link to="/gerente"            onClick={close}>Painel</Link></li>
        )}

        {!isAuthenticated ? (
          <li><Link to="/login" onClick={close}>Login</Link></li>
        ) : (
          <li>
            <button
              onClick={handleLogout}
              style={{
                background: 'none', border: 'none', color: '#fff',
                cursor: 'pointer', letterSpacing: '3px',
                font: 'inherit', padding: 0,
              }}
            >
              Sair ({user?.nome?.split(' ')[0]})
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
