import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faReact, 
  faHtml5, 
  faCss3Alt, 
  faJs, 
  faNodeJs, 
  faJava, 
  faGitAlt, 
  faFigma 
} from '@fortawesome/free-brands-svg-icons';

interface TechLogoProps {
  name: string;
  className?: string;
}

export const TechLogo: React.FC<TechLogoProps> = ({ name, className = "" }) => {
  const renderLogo = () => {
    switch (name) {
      case 'React':
        return <FontAwesomeIcon icon={faReact} className={`tech-logo ${className}`} />;
      case 'HTML5':
        return <FontAwesomeIcon icon={faHtml5} className={`tech-logo ${className}`} />;
      case 'CSS3':
        return <FontAwesomeIcon icon={faCss3Alt} className={`tech-logo ${className}`} />;
      case 'JavaScript':
        return <FontAwesomeIcon icon={faJs} className={`tech-logo ${className}`} />;
      case 'Node.js':
        return <FontAwesomeIcon icon={faNodeJs} className={`tech-logo ${className}`} />;
      case 'TypeScript':
        return (
          <img 
            src="https://img.icons8.com/?size=100&id=HcQEdKCkXUs3&format=png&color=000000" 
            alt="TypeScript" 
            className={`tech-logo ${className}`}
            style={{ width: '50px', height: '50px' }}
          />
        );
      case 'Java':
        return <FontAwesomeIcon icon={faJava} className={`tech-logo ${className}`} />;
      case 'Git':
        return <FontAwesomeIcon icon={faGitAlt} className={`tech-logo ${className}`} />;
      case 'Figma':
        return <FontAwesomeIcon icon={faFigma} className={`tech-logo ${className}`} />;
      default:
        return <div className={`tech-logo ${className}`}>{name.charAt(0)}</div>;
    }
  };

  return renderLogo();
};
