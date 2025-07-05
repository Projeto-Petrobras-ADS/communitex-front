import React from 'react';
import Button from '../Button/Button';
import './Form.css';

const Form = ({ fields, initialData, onSubmit, onCancel, submitLabel = 'Salvar' }) => {
  const [formData, setFormData] = React.useState(initialData || {});
  const [errors, setErrors] = React.useState({});

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateField = (field, value) => {
    if (field.required && !value) {
      return `${field.label} é obrigatório`;
    }

    if (value) {
      if (field.type === 'number') {
        const numValue = Number(value);
        if (field.min !== undefined && numValue < field.min) {
          return `${field.label} deve ser maior ou igual a ${field.min}`;
        }
        if (field.max !== undefined && numValue > field.max) {
          return `${field.label} deve ser menor ou igual a ${field.max}`;
        }
      }
      
      if (field.type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
        return 'Email inválido';
      }
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getOnChange = (field) => {
    return field.onChange ? field.onChange : handleInputChange;
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: field.value !== undefined ? field.value : (formData[field.name] || ''),
      onChange: getOnChange(field),
      className: errors[field.name] ? 'error' : '',
      placeholder: field.placeholder,
      required: field.required,
    };

    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">{field.placeholder || 'Selecione...'}</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={field.rows || 3}
          />
        );

      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            step={field.step}
            min={field.min}
            max={field.max}
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type={field.type || 'text'}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {fields.map(field => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>
          {renderField(field)}
          {errors[field.name] && (
            <span className="error-message">{errors[field.name]}</span>
          )}
        </div>
      ))}

      <div className="form-actions">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button variant="primary" type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default Form;
