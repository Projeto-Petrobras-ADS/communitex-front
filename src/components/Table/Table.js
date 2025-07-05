import { useState } from 'react';
import './Table.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faEdit, faTrash, faSearch, faLocationDot, faPlus } from '@fortawesome/free-solid-svg-icons';

const Table = ({
  columns,
  data,
  onEdit,
  onDelete,
  onLocation,
  onPointInterest,
  onSort,
  onSearch,
  enablePagination = true,
  itemsPerPage = 10
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => 
    columns.some(column => 
      String(item[column.key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = enablePagination 
    ? sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : sortedData;

  const handleSort = (key) => {
    if (sortField === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(key);
      setSortDirection('asc');
    }
    
    if (onSort) onSort(key, sortField === key ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc');
  };

  const renderSortIcon = (key) => {
    if (sortField !== key) return <FontAwesomeIcon icon={faSort} />;
    return sortDirection === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} /> 
      : <FontAwesomeIcon icon={faSortDown} />;
  };

  return (
    <div className="petrobras-table-container">
      {onSearch && (
        <div className="table-search">
          <div className="search-input-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearch(e.target.value);
              }}
              className="search-input"
            />
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="petrobras-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={column.sortable ? 'sortable' : ''}
                >
                  <div className="header-content">
                    {column.title}
                    {column.sortable && (
                      <span className="sort-icon">
                        {renderSortIcon(column.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onLocation || onPointInterest) && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render 
                        ? column.render(row[column.key], row) 
                        : row[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete || onLocation) && (
                    <td className="actions-cell">
                      {onLocation && (
                        <button 
                          onClick={() => onLocation(row)}
                          className="action-btn location-btn"
                          title="Ver localização"
                        >
                          <FontAwesomeIcon icon={faLocationDot} />
                        </button>
                      )}
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(row)}
                          className="action-btn edit-btn"
                          title="Editar"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      )}
                       {onPointInterest && (
                        <button 
                          onClick={() => onPointInterest(row)}
                          className="action-btn create-btn"
                          title="Cadastrar ponto de interesse"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="action-btn delete-btn"
                          title="Excluir"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + ((onEdit || onDelete || onPointInterest) ? 1 : 0)} className="no-data">
                  Nenhum registro encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {enablePagination && totalPages > 1 && (
        <div className="table-pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Anterior
          </button>
          
          <span className="page-info">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;