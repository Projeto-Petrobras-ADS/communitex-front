import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { useLocation } from "react-router-dom";
import "./MapaLocalizacao.css"

const MapaLocalizacao = () => {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedBairro, setSelectedBairro] = useState("");
    const [coords, setCoords] = useState([-23.5505, -46.6333]);
    const [error, setError] = useState("");
    const mapRef = useRef(null);
    const location = useLocation();


    const fetchSuggestions = async (query) => {
        if (query.length < 3) return;

        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${query}, Brasil&limit=5`
            );
            setSuggestions(response.data.map(item => item.display_name));
        } catch (err) {
            console.error("Erro ao buscar sugestões:", err);
        }
    };

    // Busca as coordenadas do bairro selecionado
    const buscarBairro = async (bairro) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${bairro}, Brasil&limit=1`
            );

            if (response.data.length > 0) {
                const { lat, lon, display_name } = response.data[0];
                const newCoords = [parseFloat(lat), parseFloat(lon)];
                setCoords(newCoords);
                setSelectedBairro(display_name);
                setError("");
                setSuggestions([]);

                if (mapRef.current) {
                    mapRef.current.flyTo(newCoords, 15, { duration: 1 });
                }
            } else {
                setError("Bairro não encontrado!");
            }
        } catch (err) {
            setError("Erro ao buscar o bairro.");
        }
    };


    useEffect(() => {
        if (inputValue) fetchSuggestions(inputValue);
    }, [inputValue]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const bairro = params.get('bairro');
        const municipio = params.get('municipio');
        if (bairro && municipio) {
            setInputValue(`${bairro}, ${municipio}`);
            buscarBairro(`${bairro}, ${municipio}`);
        }
    }, [location.search]);

    return (
        <div className="mapa-localizacao-container">
            <div className="mapa-localizacao-search">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && buscarBairro(inputValue)}
                    placeholder="Digite um bairro (ex: Copacabana)"
                    className="mapa-localizacao-input"
                />
                <button onClick={() => buscarBairro(inputValue)}>Buscar</button>

                {suggestions.length > 0 && (
                    <ul className="mapa-localizacao-suggestions">
                        {suggestions.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    setInputValue(item);
                                    buscarBairro(item);
                                }}
                                className="mapa-localizacao-suggestion-item"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
                {error && <p className="mapa-localizacao-error">{error}</p>}
            </div>

            <MapContainer
                center={coords}
                zoom={15}
                className="mapa-localizacao-map"
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Circle
                    center={coords}
                    radius={1000}
                    color="blue"
                    fillOpacity={0.2}
                >
                    <Popup>{selectedBairro || "Localização atual"}</Popup>
                </Circle>
            </MapContainer>
        </div>
    );
};

export default MapaLocalizacao;