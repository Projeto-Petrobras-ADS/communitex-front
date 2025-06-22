// Semente de dados mock para localStorage
const mockUFs = [
    { id: '1', sigla: 'SP', nome: 'São Paulo', regiao: 'Sudeste', populacao: 46289333, area: 248222.8, pib: 2630000000000 },
    { id: '2', sigla: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste', populacao: 17366189, area: 43780.2, pib: 758000000000 },
    { id: '3', sigla: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste', populacao: 21168791, area: 586528.3, pib: 669000000000 },
    { id: '4', sigla: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul', populacao: 11377239, area: 281748.5, pib: 553000000000 },
    { id: '5', sigla: 'SC', nome: 'Santa Catarina', regiao: 'Sul', populacao: 7338473, area: 95736.2, pib: 383000000000 },
    { id: '6', sigla: 'PR', nome: 'Paraná', regiao: 'Sul', populacao: 11516840, area: 199307.9, pib: 482000000000 },
    { id: '7', sigla: 'BA', nome: 'Bahia', regiao: 'Nordeste', populacao: 14873064, area: 564733.2, pib: 294000000000 },
    { id: '8', sigla: 'PE', nome: 'Pernambuco', regiao: 'Nordeste', populacao: 9674793, area: 98311.6, pib: 205000000000 },
    { id: '9', sigla: 'CE', nome: 'Ceará', regiao: 'Nordeste', populacao: 9187103, area: 148920.5, pib: 170000000000 },
    { id: '10', sigla: 'PA', nome: 'Pará', regiao: 'Norte', populacao: 8690745, area: 1247689.5, pib: 170000000000 },
    { id: '11', sigla: 'AM', nome: 'Amazonas', regiao: 'Norte', populacao: 4207714, area: 1559159.1, pib: 110000000000 },
    { id: '12', sigla: 'TO', nome: 'Tocantins', regiao: 'Norte', populacao: 1590248, area: 277720.5, pib: 36000000000 },
    { id: '13', sigla: 'GO', nome: 'Goiás', regiao: 'Centro-Oeste', populacao: 7206589, area: 340086.7, pib: 262000000000 },
    { id: '14', sigla: 'DF', nome: 'Distrito Federal', regiao: 'Centro-Oeste', populacao: 3055149, area: 5779.9, pib: 273000000000 },
    { id: '15', sigla: 'MT', nome: 'Mato Grosso', regiao: 'Centro-Oeste', populacao: 3567234, area: 903357.9, pib: 150000000000 },
    { id: '16', sigla: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste', populacao: 2839188, area: 357145.5, pib: 120000000000 },
    { id: '17', sigla: 'MA', nome: 'Maranhão', regiao: 'Nordeste', populacao: 7075181, area: 331983.3, pib: 98000000000 },
    { id: '18', sigla: 'PB', nome: 'Paraíba', regiao: 'Nordeste', populacao: 4018127, area: 56585.0, pib: 75000000000 },
    { id: '19', sigla: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste', populacao: 3506853, area: 52811.1, pib: 66000000000 },
    { id: '20', sigla: 'AL', nome: 'Alagoas', regiao: 'Nordeste', populacao: 3351543, area: 27767.7, pib: 57000000000 },
    { id: '21', sigla: 'PI', nome: 'Piauí', regiao: 'Nordeste', populacao: 3273227, area: 251529.2, pib: 54000000000 },
    { id: '22', sigla: 'SE', nome: 'Sergipe', regiao: 'Nordeste', populacao: 2318822, area: 21915.1, pib: 46000000000 },
    { id: '23', sigla: 'RO', nome: 'Rondônia', regiao: 'Norte', populacao: 1815278, area: 237590.5, pib: 53000000000 },
    { id: '24', sigla: 'AC', nome: 'Acre', regiao: 'Norte', populacao: 906876, area: 164123.0, pib: 17000000000 },
    { id: '25', sigla: 'AP', nome: 'Amapá', regiao: 'Norte', populacao: 877613, area: 142828.5, pib: 16000000000 },
    { id: '26', sigla: 'RR', nome: 'Roraima', regiao: 'Norte', populacao: 652713, area: 224299.0, pib: 15000000000 },
    { id: '27', sigla: 'ES', nome: 'Espírito Santo', regiao: 'Sudeste', populacao: 4108508, area: 46077.5, pib: 256000000000 }
];

const mockMunicipios = [
    { id: '1', nome: 'São Paulo', uf: 'SP' },
    { id: '2', nome: 'Rio de Janeiro', uf: 'RJ' },
    { id: '3', nome: 'Belo Horizonte', uf: 'MG' }
];

const mockBairros = [
    { id: '1', nome: 'Centro', municipioId: '1', populacao: 50000, area: 12.5, regiao: 'Central' },
    { id: '2', nome: 'Copacabana', municipioId: '2', populacao: 80000, area: 8.2, regiao: 'Zona Sul' },
    { id: '3', nome: 'Savassi', municipioId: '3', populacao: 30000, area: 5.1, regiao: 'Centro-Sul' }
];

const mockComunidades = [
    {
        id: '1',
        nome: 'Comunidade Esperança',
        bairroId: '1',
        bairro: 'Centro',
        municipioId: '1',
        municipio: 'São Paulo',
        uf: 'SP',
        regiao: 'Sudeste',
        populacao: 1200,
        area: 0.8,
        lider: 'Maria Silva'
    },
    {
        id: '2',
        nome: 'Comunidade do Mar',
        bairroId: '2',
        bairro: 'Copacabana',
        municipioId: '2',
        municipio: 'Rio de Janeiro',
        uf: 'RJ',
        regiao: 'Sudeste',
        populacao: 950,
        area: 0.5,
        lider: 'João Souza'
    },
    {
        id: '3',
        nome: 'Comunidade Horizonte',
        bairroId: '3',
        bairro: 'Savassi',
        municipioId: '3',
        municipio: 'Belo Horizonte',
        uf: 'MG',
        regiao: 'Sudeste',
        populacao: 700,
        area: 0.3,
        lider: 'Ana Lima'
    }
];

const mockIndicadores = [
    {
        id: '1',
        idh: 5.6,
        nome: 'Indicador Socioeconômico',
        comunidadeId: '1',
        comunidade: 'Comunidade Esperança',
        ano: 2024,
        rendaMedia: 1800,
        escolaridadeMedia: 85.0, // porcentagem
        taxaDesemprego: 0.2,
        observacoes: 'A comunidade apresenta bons índices de escolaridade e renda média acima da média regional.'
    },
    {
        id: '2',
        idh: 10.0,
        nome: 'Indicador Socioeconômico',
        comunidadeId: '2',
        comunidade: 'Comunidade do Mar',
        ano: 2024,
        rendaMedia: 1500,
        escolaridadeMedia: 72.5, // porcentagem
        taxaDesemprego: 0.5,
        observacoes: 'A taxa de desemprego está em elevação, mas a escolaridade média permanece estável.'
    },
    {
        id: '3',
        idh: 20.0,
        nome: 'Indicador Socioeconômico',
        comunidadeId: '3',
        comunidade: 'Comunidade Horizonte',
        ano: 2024,
        rendaMedia: 1200,
        escolaridadeMedia: 60.3, // porcentagem
        taxaDesemprego: 0.7,
        observacoes: 'Necessário investir em programas de capacitação profissional e incentivo à permanência escolar.'
    }
];

function seedMockData() {
    if (!localStorage.getItem('ufs')) {
        localStorage.setItem('ufs', JSON.stringify(mockUFs));
    }
    if (!localStorage.getItem('municipios')) {
        localStorage.setItem('municipios', JSON.stringify(mockMunicipios));
    }
    if (!localStorage.getItem('bairros')) {
        localStorage.setItem('bairros', JSON.stringify(mockBairros));
    }
    if (!localStorage.getItem('comunidades')) {
        localStorage.setItem('comunidades', JSON.stringify(mockComunidades));
    }
    if (!localStorage.getItem('indicadores')) {
        localStorage.setItem('indicadores', JSON.stringify(mockIndicadores));
    }
}

export default seedMockData;
