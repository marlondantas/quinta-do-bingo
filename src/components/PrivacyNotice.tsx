import { useState, useEffect } from 'react';

export function PrivacyNotice() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('bingo-privacy-accepted');
    if (!hasAccepted) {
      setShowNotice(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('bingo-privacy-accepted', 'true');
    setShowNotice(false);
  };

  const handleDecline = () => {
    localStorage.setItem('bingo-privacy-declined', 'true');
    setShowNotice(false);
    // Opcional: desabilitar analytics
  };

  if (!showNotice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md mx-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          🔒 Aviso de Privacidade
        </h3>
        <div className="text-sm text-gray-600 mb-6 space-y-2">
          <p>
            Este jogo coleta <strong>dados anônimos de uso</strong> para melhorar sua experiência:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Criação de novas cartelas</li>
            <li>Progresso do jogo (casas marcadas)</li>
            <li>Horários de uso</li>
          </ul>
          <p className="text-xs">
            ❌ <strong>Não coletamos:</strong> dados pessoais, localização ou informações do dispositivo.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Recusar
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}