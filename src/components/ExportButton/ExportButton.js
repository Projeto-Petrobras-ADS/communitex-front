import React, { useState } from 'react';

import * as XLSX from 'xlsx';
import './ExportButton.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const ExportButton = ({ data, indicator, region, year, subgroup }) => {
  const [exportOptions, setExportOptions] = useState({
    includeChart: true,
    includeData: true,
    includeMetadata: true,
    layout: 'portrait'
  });
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExportOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExportOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: exportOptions.layout,
        unit: 'mm'
      });
  
      // 1. Adicionar título e metadados
      doc.setFontSize(16);
      doc.text(`Relatório - ${data.indicator || 'Indicador'}`, 105, 15, { align: 'center' });
  
      if (exportOptions.includeMetadata) {
        doc.setFontSize(10);
        doc.text(`Região: ${region === 'all' ? 'Todas' : region}`, 15, 25);
        doc.text(`Ano: ${year}`, 15, 30);
      }
  
      let yPosition = 35;
  
      // 2. Adicionar gráfico (se habilitado)
      if (exportOptions.includeChart) {
        const chartElement = document.querySelector('.chart-container canvas');
        
        if (chartElement) {
          // Converter canvas para imagem
          const chartImage = chartElement.toDataURL('image/png');
          
          // Dimensões do gráfico no PDF (largura máxima 180mm)
          const imgWidth = 180;
          const imgHeight = (chartElement.height * imgWidth) / chartElement.width;
          
          // Adicionar imagem e atualizar posição Y
          doc.addImage(chartImage, 'PNG', 15, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10; // Espaço após o gráfico
        }
      }
  
      // 3. Adicionar tabela (se habilitado)
      if (exportOptions.includeData && data?.rawData?.length) {
        doc.setFontSize(12);
        doc.text('Dados Detalhados', 15, yPosition);
        yPosition += 10;
  
        autoTable(doc, {
          head: [['Categoria', 'Valor', 'Unidade']],
          body: data.rawData.map(item => [
            item.categoria || 'N/A',
            item.valor?.toFixed?.(2) || '0.00',
            item.unidade || '%'
          ]),
          startY: yPosition,
          margin: { horizontal: 15 },
          styles: { fontSize: 10 },
          headStyles: { fillColor: [78, 121, 167] }
        });
      }
  
      // 4. Rodapé
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text('Gerado automaticamente - Sistema de Relatórios', 105, 285, { align: 'center' });
  
      doc.save(`relatorio_${indicator}_${year}.pdf`);
  
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Erro na geração do PDF: ' + err.message);
    }
  };

  const exportToExcel = () => {
    try {
      if (!data?.rawData) {
        throw new Error('Dados não disponíveis para exportação');
      }

      const workbook = XLSX.utils.book_new();
      
      // Planilha de dados
      const wsData = XLSX.utils.json_to_sheet(data.rawData.map(item => ({
        Categoria: item?.categoria || 'N/A',
        Valor: item?.valor || 0,
        Unidade: item?.unidade || '%'
      })));
      XLSX.utils.book_append_sheet(workbook, wsData, 'Dados');
      
      // Planilha de metadados
      const metadata = [
        { Campo: 'Indicador', Valor: data?.indicator || 'N/A' },
        { Campo: 'Subgrupo', Valor: data?.subgroup || 'N/A' },
        { Campo: 'Região', Valor: region === 'all' ? 'Todas' : region },
        { Campo: 'Ano', Valor: year },
        { Campo: 'Data de geração', Valor: new Date().toLocaleDateString() }
      ];
      const wsMeta = XLSX.utils.json_to_sheet(metadata);
      XLSX.utils.book_append_sheet(workbook, wsMeta, 'Metadados');
      
      XLSX.writeFile(workbook, `dados_${indicator}_${year}.xlsx`);
    } catch (err) {
      console.error('Erro ao gerar Excel:', err);
      alert('Erro ao gerar o Excel. Verifique se os dados estão disponíveis.');
    } finally {
      setShowExportModal(false);
    }
  };

  return (
    <div className="export-button-container">
      <button 
        className="export-button"
        onClick={() => setShowExportModal(true)}
      >
        Exportar Relatório
      </button>

      {showExportModal && (
        <div className="modal-overlay">
          <div className="export-modal">
            <h3>Opções de Exportação</h3>
            <div className="export-options">
              <label>
                <input
                  type="checkbox"
                  name="includeChart"
                  checked={exportOptions.includeChart}
                  onChange={handleExportOptionChange}
                />
                Incluir Gráfico
              </label>
              
              <label>
                <input
                  type="checkbox"
                  name="includeData"
                  checked={exportOptions.includeData}
                  onChange={handleExportOptionChange}
                />
                Incluir Tabela de Dados
              </label>
              
              <label>
                <input
                  type="checkbox"
                  name="includeMetadata"
                  checked={exportOptions.includeMetadata}
                  onChange={handleExportOptionChange}
                />
                Incluir Metadados
              </label>
              
              <div className="layout-options">
                <span>Layout do PDF:</span>
                <label>
                  <input
                    type="radio"
                    name="layout"
                    value="portrait"
                    checked={exportOptions.layout === 'portrait'}
                    onChange={handleExportOptionChange}
                  />
                  Retrato
                </label>
                <label>
                  <input
                    type="radio"
                    name="layout"
                    value="landscape"
                    checked={exportOptions.layout === 'landscape'}
                    onChange={handleExportOptionChange}
                  />
                  Paisagem
                </label>
              </div>
            </div>
            
            <div className="export-buttons">
              <button className="export-pdf" onClick={exportToPDF}>
                Exportar para PDF
              </button>
              <button className="export-excel" onClick={exportToExcel}>
                Exportar para Excel
              </button>
              <button className="cancel" onClick={() => setShowExportModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;