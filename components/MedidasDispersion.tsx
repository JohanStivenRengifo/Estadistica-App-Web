'use client';

import { MedidasDispersion as MedidasDispersionType } from '../lib/types';

interface MedidasDispersionProps {
  medidas: MedidasDispersionType;
}

export function MedidasDispersion({ medidas }: MedidasDispersionProps) {
  return (
    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
      <h3 className="text-lg font-bold text-green-800 mb-4">
        Medidas de Dispersión
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-green-600 mb-2">
            {medidas.varianza.toFixed(4)}
          </div>
          <div className="text-sm text-gray-600 font-medium">Varianza (σ²)</div>
        </div>

        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-green-600 mb-2">
            {medidas.desviacionEstandar.toFixed(4)}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Desv. Estándar (σ)
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-green-600 mb-2">
            {medidas.rango.toFixed(4)}
          </div>
          <div className="text-sm text-gray-600 font-medium">Rango (R)</div>
        </div>

        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-green-600 mb-2">
            {medidas.coeficienteVariacion.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Coef. Variación (CV)
          </div>
        </div>
      </div>
    </div>
  );
}
