import React, { useState, useEffect } from 'react';
import { Mail, Phone, Linkedin, ExternalLink, Code, ChevronDown, Github, Construction } from 'lucide-react';
import GooeyNav from './components/GooeyNav';
import Iridescence from './components/Iridescence';
import './App.css';

interface Language {
  code: 'pt' | 'en';
  flag: string;
}

interface Translations {
  [key: string]: {
    pt: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { pt: 'Início', en: 'Home' },
  about: { pt: 'Sobre', en: 'About' },
  skills: { pt: 'Habilidades', en: 'Skills' },
  timeline: { pt: 'Timeline', en: 'Timeline' },
  projects: { pt: 'Projetos', en: 'Projects' },
  contact: { pt: 'Contato', en: 'Contact' },
  
  // Hero Section
  heroTitle: { pt: 'Eduardo Piazza', en: 'Eduardo Piazza' },
  heroSubtitle: { pt: 'Desenvolvedor Full Stack', en: 'Full Stack Developer' },
  heroDescription: { pt: 'Transformando ideias em experiências digitais incríveis', en: 'Transforming ideas into incredible digital experiences' },
  heroButton: { pt: 'Vamos conversar?', en: 'Let\'s talk?' },
  
  // About Section
  aboutTitle: { pt: 'Sobre Mim', en: 'About Me' },
  aboutText: { pt: 'Desenvolvedor apaixonado por criar soluções inovadoras e experiências digitais marcantes. Especializado em tecnologias modernas com foco em performance e usabilidade.', en: 'Developer passionate about creating innovative solutions and remarkable digital experiences. Specialized in modern technologies with focus on performance and usability.' },
  
  // Skills Section
  skillsTitle: { pt: 'Habilidades Técnicas', en: 'Technical Skills' },
  skillsSubtitle: { pt: 'Tecnologias que domino', en: 'Technologies I master' },
  
  // Timeline Section
  timelineTitle: { pt: 'Minha Jornada', en: 'My Journey' },
  timeline2024: { pt: 'Desenvolvedor Full Stack', en: 'Full Stack Developer' },
  timeline2024Desc: { pt: 'Criação de sites e aplicações web', en: 'Creating websites and web applications' },
  timeline2023Alura: { pt: 'Certificações ALURA', en: 'ALURA Certifications' },
  timeline2023AluraDesc: { pt: 'Especialização em desenvolvimento web', en: 'Specialization in web development' },
  timeline2023IBM: { pt: 'Curso IBM', en: 'IBM Course' },
  timeline2023IBMDesc: { pt: 'Aprofundamento em tecnologias empresariais', en: 'Deep dive into enterprise technologies' },
  
  // Projects Section
  projectsTitle: { pt: 'Meus Projetos', en: 'My Projects' },
  projectsSubtitle: { pt: 'Trabalhos que demonstram minhas habilidades', en: 'Work that demonstrates my skills' },
  portfolioProject: { pt: 'Portfolio Pessoal', en: 'Personal Portfolio' },
  portfolioDesc: { pt: 'Site responsivo desenvolvido para apresentar projetos e habilidades', en: 'Responsive website developed to showcase projects and skills' },
  studyProjects: { pt: 'Sites de Estudo', en: 'Study Projects' },
  studyDesc: { pt: 'Projetos diversos para prática e aprendizado', en: 'Various projects for practice and learning' },
  viewLive: { pt: 'Ver Live', en: 'View Live' },
  viewCode: { pt: 'Ver Código', en: 'View Code' },
  
  // Contact Section
  contactTitle: { pt: 'Vamos Trabalhar Juntos?', en: 'Let\'s Work Together?' },
  contactSubtitle: { pt: 'Entre em contato comigo', en: 'Get in touch with me' },
  contactName: { pt: 'Nome', en: 'Name' },
  contactEmail: { pt: 'Email', en: 'Email' },
  contactMessage: { pt: 'Mensagem', en: 'Message' },
  contactSend: { pt: 'Enviar Mensagem', en: 'Send Message' },
  
  // CTA
  ctaTitle: { pt: 'Pronto para transformar sua ideia em realidade digital?', en: 'Ready to transform your idea into digital reality?' },
  ctaDescription: { pt: 'Especializado em desenvolvimento full stack com foco em experiências modernas e performáticas.', en: 'Specialized in full stack development with focus on modern and performant experiences.' },
  ctaButton: { pt: 'Vamos conversar sobre seu projeto!', en: 'Let\'s talk about your project!' }
};

const techStack = [
  { name: 'HTML5', color: '#E34F26', level: 90 },
  { name: 'CSS3', color: '#1572B6', level: 85 },
  { name: 'JavaScript', color: '#F7DF1E', level: 88 },
  { name: 'TypeScript', color: '#3178C6', level: 82 },
  { name: 'React', color: '#61DAFB', level: 85 },
  { name: 'Node.js', color: '#339933', level: 80 },
  { name: 'Java', color: '#007396', level: 75 },
  { name: 'Git', color: '#F05032', level: 90 },
  { name: 'Figma', color: '#F24E1E', level: 70 }
];

const timelineData = [
  {
    year: '2025',
    title: 'timeline2024',
    description: 'timeline2024Desc',
    tech: ['React', 'Node.js', 'TypeScript']
  },
  {
    year: '2025',
    title: 'timeline2023Alura',
    description: 'timeline2023AluraDesc',
    tech: ['HTML', 'CSS', 'JavaScript', 'Java', 'Git']
  },
  {
    year: '2025',
    title: 'timeline2023IBM',
    description: 'timeline2023IBMDesc',
    tech: ['Lógica', 'JavaScript']
  }
];

const projects = [
  {
    title: 'portfolioProject',
    description: 'portfolioDesc',
    tech: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React'],
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    liveUrl: '#',
    codeUrl: '#'
  },
  {
    title: 'Amostra de Loja',
    description: 'Projeto de e-commerce em desenvolvimento com funcionalidades modernas',
    tech: ['React', 'Node.js', 'TypeScript', 'Stripe'],
    image: '/Captura de tela 2025-08-06 180000.png',
    liveUrl: 'https://piazzastore.vercel.app',
    codeUrl: 'https://github.com/piazzaxyz/PiazzaStore'
  }
];

const NFTAvatar = () => {
  return (
    <div className="nft-avatar">
      {/* Background code elements */}
      <div className="nft-background-code">
        <div className="code-line" style={{ top: '10%', left: '5%', fontSize: '8px', opacity: 0.3 }}>
          const dev = {'{'}<br />
          &nbsp;&nbsp;name: "PZ"<br />
          {'}'};
        </div>
        <div className="code-line" style={{ top: '20%', right: '5%', fontSize: '6px', opacity: 0.2 }}>
          function code() {'{'}<br />
          &nbsp;&nbsp;return "PZ";<br />
          {'}'}
        </div>
        <div className="code-line" style={{ bottom: '15%', left: '8%', fontSize: '7px', opacity: 0.25 }}>
          &lt;PZ /&gt;
        </div>
        <div className="code-line" style={{ top: '60%', right: '8%', fontSize: '9px', opacity: 0.3, fontWeight: 'bold' }}>
          PZ
        </div>
        <div className="code-line" style={{ top: '40%', left: '10%', fontSize: '6px', opacity: 0.2 }}>
          console.log("PZ");
        </div>
        <div className="code-line" style={{ bottom: '40%', right: '12%', fontSize: '8px', opacity: 0.25 }}>
          #PZ {'{'} color: red; {'}'}
        </div>
        <div className="code-line" style={{ top: '80%', left: '15%', fontSize: '10px', opacity: 0.35, color: '#ff6666' }}>
          PZ
        </div>
      </div>
      
      <div className="nft-character">
        <div className="nft-head">
          <div className="nft-hair"></div>
          <div className="nft-eyes">
            <div className="nft-eye left"></div>
            <div className="nft-eye right"></div>
          </div>
        </div>
        <div className="nft-suit">
          <div className="nft-tie"></div>
        </div>
      </div>
      <div className="nft-code">
        const dev = {'{'}
        <br />
        &nbsp;&nbsp;name: "PZ",
        <br />
        &nbsp;&nbsp;level: 99
        <br />
        {'}'};
      </div>
      <div className="nft-effects"></div>
    </div>
  );
};

function App() {
  const [currentLang, setCurrentLang] = useState<'pt' | 'en'>('pt');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = (key: string): string => {
    return translations[key]?.[currentLang] || key;
  };

  const toggleLanguage = () => {
    setCurrentLang(currentLang === 'pt' ? 'en' : 'pt');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: t('home'), href: '#home' },
    { label: t('about'), href: '#about' },
    { label: t('contact'), href: '#contact' }
  ];

  const handleNavClick = (index: number, item: { label: string; href: string }) => {
    const sectionId = item.href.replace('#', '');
    scrollToSection(sectionId);
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToNext = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Criar assunto e corpo do email formatados para Gmail web
    const subject = currentLang === 'pt' 
      ? `Contato Profissional - ${name}` 
      : `Professional Contact - ${name}`;
    
    const emailBody = currentLang === 'pt'
      ? `Olá Eduardo,\n\nMeu nome é ${name} e gostaria de entrar em contato com você.\n\nDetalhes do contato:\nNome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}\n\nAtenciosamente,\n${name}`
      : `Hello Eduardo,\n\nMy name is ${name} and I would like to get in touch with you.\n\nContact details:\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nBest regards,\n${name}`;
    
    // Criar o link do Gmail web
    const gmailLink = `https://mail.google.com/mail/?view=cm&to=dudupiazza16@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(gmailLink, '_blank');
    
    // Limpar o formulário após envio
    e.currentTarget.reset();
    
    // Mostrar feedback visual (opcional)
    const submitBtn = e.currentTarget.querySelector('.submit-btn') as HTMLButtonElement;
    if (submitBtn) {
      const originalText = submitBtn.textContent;
      submitBtn.textContent = currentLang === 'pt' ? 'Email enviado!' : 'Email sent!';
      submitBtn.style.background = '#28a745';
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
      }, 3000);
    }
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/+555193693721', '_blank');
  };

  return (
    <div className="App">
      {/* Particles Background */}
      <div className="particles-container">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }} />
        ))}
      </div>

      {/* Header */}
      <header className={`header ${scrollY > 50 ? 'scrolled' : ''}`}>
        <div className="header-background">
          <Iridescence
            color={[0.5, 0.1, 0.1]}
            speed={0.3}
            amplitude={0.02}
            mouseReact={false}
          />
        </div>
        <div className="container">
          <div className="logo">
            <span className="logo-text">PZ</span>
          </div>
          
          <div className="nav">
            <div className="desktop-nav">
              <GooeyNav
                items={navItems}
                onItemClick={handleNavClick}
                particleCount={10}
                particleDistances={[60, 5]}
                particleR={80}
                animationTime={400}
                timeVariance={200}
              />
            </div>
          </div>

          <div className="header-actions">
            <button className="lang-toggle" onClick={toggleLanguage}>
              <div className={`flag-container ${currentLang === 'pt' ? 'active' : ''}`}>
                <span className="flag-text">BR</span>
              </div>
              <div className={`flag-container ${currentLang === 'en' ? 'active' : ''}`}>
                <span className="flag-text">US</span>
              </div>
            </button>
            
            <button 
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <a href="#home" onClick={() => scrollToSection('home')}>{t('home')}</a>
          <a href="#about" onClick={() => scrollToSection('about')}>{t('about')}</a>
          <a href="#skills" onClick={() => scrollToSection('skills')}>{t('skills')}</a>
          <a href="#timeline" onClick={() => scrollToSection('timeline')}>{t('timeline')}</a>
          <a href="#projects" onClick={() => scrollToSection('projects')}>{t('projects')}</a>
          <a href="#contact" onClick={() => scrollToSection('contact')}>{t('contact')}</a>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="photo-container">
              <div className="photo-wrapper">
                <img 
                  src="/EduardoPiazza.jpeg" 
                  alt="Eduardo Piazza" 
                  className="profile-photo"
                />
                <div className="nft-photo">
                  <NFTAvatar />
                </div>
              </div>
            </div>
            
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="typewriter">{t('heroTitle')}</span>
              </h1>
              <h2 className="hero-subtitle">{t('heroSubtitle')}</h2>
              <p className="hero-description">{t('heroDescription')}</p>
              <button className="cta-button" onClick={openWhatsApp}>
                {t('heroButton')}
              </button>
            </div>
          </div>
          
          <div className="scroll-indicator" onClick={scrollToNext} style={{ cursor: 'pointer' }}>
            <ChevronDown className="scroll-arrow" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title">{t('aboutTitle')}</h2>
          <p className="about-text">{t('aboutText')}</p>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills">
        <div className="container">
          <h2 className="section-title">{t('skillsTitle')}</h2>
          <p className="section-subtitle">{t('skillsSubtitle')}</p>
          
          <div className="tech-grid">
            {techStack.map((tech, index) => (
              <div key={tech.name} className="tech-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="tech-icon" style={{ backgroundColor: tech.color }}>
                  {tech.name.charAt(0)}
                </div>
                <h3>{tech.name}</h3>
                <div className="skill-bar">
                  <div 
                    className="skill-progress" 
                    style={{ 
                      width: `${tech.level}%`,
                      backgroundColor: tech.color 
                    }}
                  ></div>
                </div>
                <span className="skill-percentage">{tech.level}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="timeline-section">
        <div className="container">
          <h2 className="section-title">{t('timelineTitle')}</h2>
          
          <div className="timeline">
            {timelineData.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <span className="timeline-year">{item.year}</span>
                </div>
                <div className="timeline-content">
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.description)}</p>
                  <div className="timeline-tech">
                    {item.tech.map((tech) => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title">{t('projectsTitle')}</h2>
          <p className="section-subtitle">{t('projectsSubtitle')}</p>
          
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-image">
                  <img src={project.image} alt={t(project.title)} />
                  <div className="project-overlay">
                    {project.liveUrl && (
                      <a href={project.liveUrl} className="project-btn live-btn" target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={16} />
                        {t('viewLive')}
                      </a>
                    )}
                    <a href={project.codeUrl} className="project-btn code-btn" target="_blank" rel="noopener noreferrer">
                      <Code size={16} />
                      {t('viewCode')}
                    </a>
                  </div>
                </div>
                
                <div className="project-info">
                  <h3>{t(project.title)}</h3>
                  <p>{t(project.description)}</p>
                  <div className="project-tech">
                    {project.tech.map((tech) => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {scrollY > 300 && (
        <button 
          className="scroll-to-top" 
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'linear-gradient(45deg, var(--primary-red), var(--secondary-red))',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1000,
            boxShadow: '0 4px 15px rgba(139, 0, 0, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 0, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 0, 0, 0.3)';
          }}
        >
          <ChevronDown style={{ transform: 'rotate(180deg)' }} size={20} />
        </button>
      )}

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">{t('contactTitle')}</h2>
          <p className="section-subtitle">{t('contactSubtitle')}</p>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <Mail className="contact-icon" />
                <span>dudupiazza16@gmail.com</span>
              </div>
              
              <div className="contact-item">
                <Phone className="contact-icon" />
                <span>+55 51 99369-3721</span>
              </div>
              
              <div className="contact-item">
                <Mail className="contact-icon" />
                <span>Porto Alegre - 90810-150</span>
              </div>
              
              <div className="contact-item">
                <Linkedin className="contact-icon" />
                <a href="https://linkedin.com/in/eduardo-siqueira-de-melo-piazza-08b1b42b3" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </div>
              
              <div className="contact-item">
                <Github className="contact-icon" />
                <a href="https://github.com/piazzaxyz" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </div>
            </div>
            
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <input 
                type="text" 
                name="name"
                placeholder={t('contactName')} 
                required 
              />
              <input 
                type="email" 
                name="email"
                placeholder={t('contactEmail')} 
                required 
              />
              <textarea 
                name="message"
                placeholder={t('contactMessage')} 
                required
                rows={5}
              ></textarea>
              <button type="submit" className="submit-btn">
                {t('contactSend')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Eduardo Piazza. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;