import './Button.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  return (
    <button
      className={`petrobras-btn ${variant} ${size} ${fullWidth ? 'full-width' : ''} ${loading ? 'loading' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
    >
      {loading ? (
        <span className="loading-spinner"></span>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <FontAwesomeIcon icon={icon} className="btn-icon left" />
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <FontAwesomeIcon icon={icon} className="btn-icon right" />
          )}
        </>
      )}
    </button>
  );
};

export default Button;