import { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import ExportButton from '../ExportButton/ExportButton';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import './SocioeconomicCharts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ChartPlaceholder = ({ height = 300 }) => (
  <div style={{
    height: `${height}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    margin: '10px 0'
  }}>
    <p>Carregando gráfico...</p>
  </div>
);

const SocioeconomicCharts = () => {
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState('all');
  const [year, setYear] = useState('2022');
  const [indicator, setIndicator] = useState('literacy');
  const [subgroup, setSubgroup] = useState('age');
  const [socioeconomicData, setSocioeconomicData] = useState({
    chartData: { labels: [], datasets: [] }
  });
  const [error, setError] = useState(null);

  const colorPalettes = {
    literacy: {
      age: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f'],
      gender: ['#4e79a7', '#e15759'],
      region: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f']
    },
    water: {
      urban_rural: ['#4e79a7', '#76b7b2'],
      income: ['#e15759', '#f28e2b', '#59a14f'],
      region: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f']
    },
    sanitation: {
      type: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2'],
      region: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f'],
      income: ['#e15759', '#f28e2b', '#59a14f']
    }
  };

  const indicators = {
    literacy: {
      name: 'Taxa de Alfabetização',
      subgroups: {
        age: 'Faixa Etária',
        gender: 'Gênero',
        region: 'Região'
      },
      chartType: 'bar'
    },
    water: {
      name: 'Acesso à Água Potável',
      subgroups: {
        urban_rural: 'Urbano/Rural',
        income: 'Por Renda',
        region: 'Por Região'
      },
      chartType: 'bar'
    },
    sanitation: {
      name: 'Saneamento Básico',
      subgroups: {
        type: 'Tipo de Saneamento',
        region: 'Por Região',
        income: 'Por Renda'
      },
      chartType: 'pie'
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const storageKey = `socioeconomic-${region}-${year}-${indicator}-${subgroup}`;
        const cacheExpiryTime = 24 * 60 * 60 * 1000;

        const cachedData = localStorage.getItem(storageKey);

        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          const isCacheValid = new Date().getTime() - parsedData.timestamp < cacheExpiryTime;

          if (isCacheValid) {
            setSocioeconomicData(parsedData.data);
            setLoading(false);
            return;
          }
        }

        await new Promise(resolve => setTimeout(resolve, 800));
        const mockData = generateMockData(region, year, indicator, subgroup);

        if (!mockData.chartData?.labels) {
          throw new Error('Estrutura de dados inválida');
        }

        const dataToCache = {
          data: mockData,
          timestamp: new Date().getTime()
        };

        localStorage.setItem(storageKey, JSON.stringify(dataToCache));

        setSocioeconomicData(mockData);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao processar dados. Tente recarregar a página.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [region, year, indicator, subgroup]);

  const generateMockData = (selectedRegion, selectedYear, selectedIndicator, selectedSubgroup) => {
    const regionFactor = selectedRegion === 'north' ? 0.8 :
      selectedRegion === 'south' ? 1.2 :
        selectedRegion === 'east' ? 0.9 :
          selectedRegion === 'west' ? 1.1 : 1;

    const palette = colorPalettes[selectedIndicator][selectedSubgroup];

    const baseData = {
      literacy: {
        age: {
          labels: ['15-24 anos', '25-34 anos', '35-44 anos', '45-59 anos', '60+ anos'],
          datasets: [{
            label: 'Taxa de Alfabetização (%)',
            data: [98, 96, 93, 88, 82].map(v => v * regionFactor),
            backgroundColor: palette
          }]
        },
        gender: {
          labels: ['Masculino', 'Feminino'],
          datasets: [{
            label: 'Taxa de Alfabetização (%)',
            data: [92, 90].map(v => v * regionFactor),
            backgroundColor: palette
          }]
        },
        region: {
          labels: ['Norte', 'Nordeste', 'Sudeste', 'Sul', 'Centro-Oeste'],
          datasets: [{
            label: 'Taxa de Alfabetização (%)',
            data: [88, 85, 95, 96, 93].map(v => v * regionFactor),
            backgroundColor: palette
          }]
        }
      },
      water: {
        urban_rural: {
          labels: ['Urbano', 'Rural'],
          datasets: [{
            label: 'Acesso à Água Potável (%)',
            data: [95, 65].map(v => v * regionFactor),
            backgroundColor: palette
          }]
        },
        income: {
          labels: ['Baixa renda', 'Média renda', 'Alta renda'],
          datasets: [{
            label: 'Acesso à Água Potável (%)',
            data: [70, 90, 99].map(v => v * regionFactor),
            backgroundColor: palette
          }]
        },
        region: {
          labels: ['Norte', 'Nordeste', 'Sudeste', 'Sul', 'Centro-Oeste'],
          datasets: [{
            label: 'Acesso à Água Potável (%)',
            data: [75, 80, 95, 92, 90].map(v => v * regionFactor),
            backgroundColor: palette
          }]
        }
      },
      sanitation: {
        type: {
          labels: ['Rede geral', 'Fossa séptica', 'Fossa rudimentar', 'Outros'],
          datasets: [{
            label: 'Tipo de Saneamento (%)',
            data: [60, 20, 15, 5].map(v => v * regionFactor),
            backgroundColor: palette
          }]
        },
        region: {
          labels: ['Norte', 'Nordeste', 'Sudeste', 'Sul', 'Centro-Oeste'],
          datasets: [{
            label: 'Acesso a Saneamento (%)',
            data: [50, 55, 80, 75, 70].map(v => v * regionFactor),
            backgroundColor: palette
          }]
        },
        income: {
          labels: ['Baixa renda', 'Média renda', 'Alta renda'],
          datasets: [{
            label: 'Acesso a Saneamento (%)',
            data: [45, 75, 95].map(v => v * regionFactor),
            backgroundColor: palette
          }]
        }
      }
    };

    return {
      chartData: baseData[selectedIndicator][selectedSubgroup],
      indicator: indicators[selectedIndicator].name,
      subgroup: indicators[selectedIndicator].subgroups[selectedSubgroup],
      chartType: indicators[selectedIndicator].chartType,
      rawData: baseData[selectedIndicator][selectedSubgroup].datasets[0].data.map((value, index) => ({
        categoria: baseData[selectedIndicator][selectedSubgroup].labels[index],
        valor: value,
        unidade: '%'
      }))
    };
  };

  const handleRegionChange = (e) => setRegion(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);
  const handleIndicatorChange = (e) => {
    setIndicator(e.target.value);
    setSubgroup(Object.keys(indicators[e.target.value].subgroups)[0]);
  };
  const handleSubgroupChange = (e) => setSubgroup(e.target.value);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando dados socioeconômicos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  const renderChart = () => {
    const { chartData, chartType } = socioeconomicData;
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: chartType === 'pie' ? 'right' : 'top',
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset?.label || context.label}: ${context.raw.toFixed(1)}%`;
            }
          }
        }
      }
    };

    if (chartType === 'pie') {
      return (
        <Pie
          data={chartData}
          options={commonOptions}
        />
      );
    } else {
      return (
        <Bar
          data={chartData}
          options={{
            ...commonOptions,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Percentual (%)'
                }
              }
            }
          }}
        />
      );
    }
  };

  return (
    <div className="charts-container">
      <h1>Indicadores Socioeconômicos</h1>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="region">Região:</label>
          <select id="region" value={region} onChange={handleRegionChange}>
            <option value="all">Todas as Regiões</option>
            <option value="north">Norte</option>
            <option value="south">Sul</option>
            <option value="east">Leste</option>
            <option value="west">Oeste</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="year">Ano Base:</label>
          <select id="year" value={year} onChange={handleYearChange}>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="indicator">Indicador:</label>
          <select id="indicator" value={indicator} onChange={handleIndicatorChange}>
            {Object.entries(indicators).map(([key, value]) => (
              <option key={key} value={key}>{value.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="subgroup">Subgrupo:</label>
          <select id="subgroup" value={subgroup} onChange={handleSubgroupChange}>
            {Object.entries(indicators[indicator].subgroups).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <ExportButton
            data={socioeconomicData}
            indicator={indicator}
            region={region}
            year={year}
            subgroup={subgroup}
          />
        </div>
      </div>

      <div className="chart-row">
        <div className="chart-card">
          <h2>{socioeconomicData.indicator} - {socioeconomicData.subgroup}</h2>
          {socioeconomicData.chartData.labels.length > 0 ? (
            <div className="chart-container" style={{ height: '400px' }}>
              {renderChart()}
            </div>
          ) : (
            <ChartPlaceholder height={400} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SocioeconomicCharts;