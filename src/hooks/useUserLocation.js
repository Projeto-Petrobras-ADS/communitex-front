// /src/hooks/useUserLocation.js
import { useState, useEffect, useCallback } from 'react';

const DEFAULT_POSITION = {
  lat: -26.3045,
  lng: -48.8487
};

/**
 * Hook customizado para obter a localização do usuário via Geolocation API
 * @param {Object} options - Opções de configuração
 * @param {boolean} options.enableHighAccuracy - Usar alta precisão (padrão: true)
 * @param {number} options.timeout - Timeout em ms (padrão: 10000)
 * @param {number} options.maximumAge - Cache máximo em ms (padrão: 0)
 * @returns {Object} { position, error, isLoading, refetch }
 */
const useUserLocation = (options = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0
  } = options;

  // Posição padrão: Centro de Joinville-SC
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador');
      setIsLoading(false);
      setPosition(DEFAULT_POSITION);
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setIsLoading(false);
      },
      (err) => {
        let errorMessage;
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada. Usando localização padrão.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível. Usando localização padrão.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Tempo esgotado ao obter localização. Usando localização padrão.';
            break;
          default:
            errorMessage = 'Erro desconhecido ao obter localização.';
        }
        setError(errorMessage);
        setPosition(DEFAULT_POSITION);
        setIsLoading(false);
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    );
  }, [enableHighAccuracy, timeout, maximumAge]);

  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  return {
    position,
    error,
    isLoading,
    refetch: getCurrentPosition
  };
};

export default useUserLocation;
