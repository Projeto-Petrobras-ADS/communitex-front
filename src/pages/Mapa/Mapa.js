import React from 'react';
import MapaLocalizacao from '../../components/Mapa/MapaLocalizacao';
function Mapa() {
    const latitude = -27.449001246230775;
    const longitude = -48.39939854274588;

    return (
        <div className="listagem-page ">
            <div className="page-header">
                <div className="header-title">
                    <h1>Localizção</h1>
                    <p>Visualize abaixo a localização geográfica de interesse no mapa interativo. Utilize este recurso para identificar, analisar e explorar pontos estratégicos da região selecionada, facilitando o planejamento e a tomada de decisões para ações comunitárias e socioeconômicas.</p>
                </div>
            </div>
            <div className="table-container">
                <MapaLocalizacao latitude={latitude} longitude={longitude} />
            </div>

        </div>


    );
}

export default Mapa;