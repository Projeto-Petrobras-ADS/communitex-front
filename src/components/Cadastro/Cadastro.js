import React from 'react';
import Form from '../Form/Form';
import './Cadastro.css';

function Cadastro({
    id,
    title,
    initialData,
    onSubmit,
    onCancel,
    formFields = [],
}) {
    return (
        <div className="cadastro-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>{id ? `Editar ${title}` : `Adicionar ${title}`}</h1>
                    <p>{id ? `Atualize os dados da ${title}` : `Preencha os dados para adicionar ${title}`}</p>
                </div>
            </div>

            <div className="form-container">
                <Form
                    fields={formFields}
                    initialData={initialData || {}}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    submitLabel={id ? 'Atualizar' : 'Salvar'}
                />
            </div>
        </div>
    );
}

export default Cadastro;
