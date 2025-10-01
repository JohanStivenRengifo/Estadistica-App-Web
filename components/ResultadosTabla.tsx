'use client';

import { FrecuenciaTabla, DatosAgrupados } from '../lib/types';

interface ResultadosTablaProps {
  tablaFrecuencias: FrecuenciaTabla[];
  datosAgrupados?: DatosAgrupados;
}

export function ResultadosTabla({
  tablaFrecuencias,
  datosAgrupados,
}: ResultadosTablaProps) {
  if (tablaFrecuencias.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Tabla de Frecuencias
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                {datosAgrupados ? 'Intervalo' : 'Valor'}
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                Marca de Clase
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                f
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                fr
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                F
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                Fr
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tablaFrecuencias.map((fila, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {datosAgrupados ? (
                    <div className="text-center">
                      <div className="font-medium bg-gray-100 px-2 py-1 rounded text-xs">
                        [
                        {datosAgrupados.intervalos[
                          index
                        ]?.limiteInferior.toFixed(2)}{' '}
                        -{' '}
                        {datosAgrupados.intervalos[
                          index
                        ]?.limiteSuperior.toFixed(2)}
                        )
                      </div>
                    </div>
                  ) : (
                    <span className="font-medium">{fila.valor.toFixed(2)}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-center font-medium">
                  {datosAgrupados
                    ? datosAgrupados.intervalos[index]?.marcaClase.toFixed(2)
                    : fila.valor.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-center font-semibold">
                  {fila.frecuenciaAbsoluta}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {(fila.frecuenciaRelativa * 100).toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-center font-semibold">
                  {fila.frecuenciaAcumulada}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    {(fila.frecuenciaRelativaAcumulada * 100).toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <p className="text-sm font-semibold text-gray-700 mb-2">Leyenda:</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
            <strong>f:</strong> Frecuencia absoluta
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
            <strong>fr:</strong> Frecuencia relativa
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-gray-600 rounded-full mr-2"></span>
            <strong>F:</strong> Frecuencia acumulada
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
            <strong>Fr:</strong> Frecuencia relativa acumulada
          </div>
        </div>
      </div>
    </div>
  );
}
