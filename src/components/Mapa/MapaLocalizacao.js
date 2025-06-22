import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapaLocalizacao({ latitude, longitude }) {

    const position = [latitude, longitude];
    const radius = 1000; // Raio em metros

    return (
        <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
     
            <Circle center={position} radius={radius} color="red" fillOpacity={0.2}>
                <Popup>Esta é uma área circular!</Popup>
            </Circle>

        </MapContainer>



    );
}

export default MapaLocalizacao;