'use client';

import { MedidasTendenciaCentral as MedidasTendenciaCentralType } from '../lib/types';

interface MedidasTendenciaCentralProps {
  medidas: MedidasTendenciaCentralType;
}

export function MedidasTendenciaCentral({
  medidas,
}: MedidasTendenciaCentralProps) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <h3 className="text-lg font-bold text-blue-800 mb-4">
        Medidas de Tendencia Central
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {medidas.media.toFixed(4)}
          </div>
          <div className="text-sm text-gray-600 font-medium">Media (x̄)</div>
        </div>

        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {medidas.mediana.toFixed(4)}
          </div>
          <div className="text-sm text-gray-600 font-medium">Mediana (Me)</div>
        </div>

        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-blue-600 mb-2">
            {medidas.moda.length > 0
              ? medidas.moda.map((m) => m.toFixed(4)).join(', ')
              : 'No hay moda'}
          </div>
          <div className="text-sm text-gray-600 font-medium">Moda (Mo)</div>
        </div>
      </div>
    </div>
  );
}
