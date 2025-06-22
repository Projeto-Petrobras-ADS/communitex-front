import React from 'react';
import Table from '../Table/Table';
import Button from '../Button/Button';
import './Listagem.css';

function Listagem({
  title,
  subtitle,
  handleAddNew,
  buttonAddNewTile,
  columns,
  data = [],
  onEdit,
  onDelete,
  onSort,
  onSearch,
  enablePagination = true,
  itemsPerPage = 10
}) {

  return (
    <div className="listagem-page ">
      <div className="page-header">
        <div className="header-title">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="header-actions">
          <Button
            variant="primary"
            onClick={handleAddNew}
          >
            {buttonAddNewTile}
          </Button>
        </div>
      </div>

      <div className="table-container">
        <Table
          columns={columns}
          data={data}
          onSort={onSort}
          onEdit={onEdit}
          onDelete={onDelete}
          onSearch={onSearch}
          enablePagination={enablePagination}
          itemsPerPage={itemsPerPage}
          searchPlaceholder="Pesquisar..."
        />
      </div>
    </div>
  );
}
export default Listagem;