import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const MapaLocalizacao = () => {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedBairro, setSelectedBairro] = useState("");
    const [coords, setCoords] = useState([-23.5505, -46.6333]); // Posição inicial (ex: São Paulo)
    const [error, setError] = useState("");
    const mapRef = useRef(null);

    // Busca sugestões de bairros enquanto o usuário digita
    const fetchSuggestions = async (query) => {
        if (query.length < 3) return; // Só busca após 3 caracteres

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
                setSuggestions([]); // Limpa as sugestões após seleção

                // Animação do mapa
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

    // Atualiza sugestões quando o input muda
    useEffect(() => {
        if (inputValue) fetchSuggestions(inputValue);
    }, [inputValue]);

    return (
        <div style={{ width: "100%", height: "500px" }}>
            <div style={{ marginBottom: "10px", position: "relative" }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && buscarBairro(inputValue)}
                    placeholder="Digite um bairro (ex: Copacabana)"
                    style={{ width: "100%", padding: "8px" }}
                />
                <button onClick={() => buscarBairro(inputValue)}>Buscar</button>

                {/* Lista de sugestões */}
                {suggestions.length > 0 && (
                    <ul style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "white",
                        border: "1px solid #ddd",
                        zIndex: 1000,
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        maxHeight: "200px",
                        overflowY: "auto"
                    }}>
                        {suggestions.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    setInputValue(item);
                                    buscarBairro(item);
                                }}
                                style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>

            <MapContainer
                center={coords}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Circle
                    center={coords}
                    radius={1000} // Raio em metros
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