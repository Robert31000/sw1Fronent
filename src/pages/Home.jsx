import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/style.css'

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth/login');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-animate-fadeInDown">
          <h1 className="home-title">
            Transforma tus espacios con <span>Realidad Aumentada</span>
          </h1>
          
          <p className="home-subtitle">
            Visualiza muebles en tu espacio antes de comprar, recibe recomendaciones de diseño inteligente y crea interiores perfectos con nuestra tecnología 3D.
          </p>
        </div>

        <div className="home-image-container">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Diseño Interior con Realidad Aumentada"
            className="home-image"
          />
          <div className="home-image-overlay" />
        </div>

        <button onClick={handleLogin} className="home-button">
          <span className="home-button-text">Comenzar Ahora</span>
          <span className="home-button-gradient" />
        </button>

        <div className="home-features">
          <div className="home-feature-card">
            <div className="home-feature-icon">🛋️</div>
            <h3 className="home-feature-title">Visualización 3D</h3>
            <p className="home-feature-description">Coloca muebles virtuales en tu espacio real usando tu cámara.</p>
          </div>
          
          <div className="home-feature-card">
            <div className="home-feature-icon">🎨</div>
            <h3 className="home-feature-title">Recomendaciones IA</h3>
            <p className="home-feature-description">Sugerencias de diseño personalizadas basadas en tus gustos.</p>
          </div>
          
          <div className="home-feature-card">
            <div className="home-feature-icon">📱</div>
            <h3 className="home-feature-title">Catálogo Completo</h3>
            <p className="home-feature-description">Explora miles de muebles y accesorios de diferentes estilos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;