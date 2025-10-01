'use client';

import { useState } from 'react';
import {
  DatosSimples,
  DatosAgrupados,
  TipoDatos,
  IntervaloClase,
} from '../lib/types';
import { EstadisticasAgrupadas } from '../lib/estadisticas';

interface EntradaDatosProps {
  tipoDatos: TipoDatos;
  setTipoDatos: (tipo: TipoDatos) => void;
  datosSimples: DatosSimples;
  setDatosSimples: (datos: DatosSimples) => void;
  datosAgrupados: DatosAgrupados;
  setDatosAgrupados: (datos: DatosAgrupados) => void;
  onCalcular: () => void;
}

export function EntradaDatos({
  tipoDatos,
  setTipoDatos,
  datosSimples,
  setDatosSimples,
  datosAgrupados,
  setDatosAgrupados,
  onCalcular,
}: EntradaDatosProps) {
  const [entradaTexto, setEntradaTexto] = useState('');
  const [numeroIntervalos, setNumeroIntervalos] = useState(5);

  const procesarDatosSimples = () => {
    const valores = entradaTexto
      .split(/[,\s]+/)
      .map((valor) => parseFloat(valor.trim()))
      .filter((valor) => !isNaN(valor));

    setDatosSimples({ valores });
  };

  const procesarDatosAgrupados = () => {
    const valores = entradaTexto
      .split(/[,\s]+/)
      .map((valor) => parseFloat(valor.trim()))
      .filter((valor) => !isNaN(valor));

    if (valores.length > 0) {
      const intervalos = EstadisticasAgrupadas.generarIntervalos(
        valores,
        numeroIntervalos
      );
      const amplitud =
        intervalos.length > 0
          ? intervalos[0].limiteSuperior - intervalos[0].limiteInferior
          : 0;

      setDatosAgrupados({ intervalos, amplitud });
    }
  };

  const agregarIntervalo = () => {
    const nuevoIntervalo: IntervaloClase = {
      limiteInferior: 0,
      limiteSuperior: 0,
      marcaClase: 0,
      frecuencia: 0,
    };

    setDatosAgrupados({
      ...datosAgrupados,
      intervalos: [...datosAgrupados.intervalos, nuevoIntervalo],
    });
  };

  const actualizarIntervalo = (
    index: number,
    campo: keyof IntervaloClase,
    valor: number
  ) => {
    const nuevosIntervalos = [...datosAgrupados.intervalos];
    nuevosIntervalos[index] = {
      ...nuevosIntervalos[index],
      [campo]: valor,
    };

    // Recalcular marca de clase si cambian los límites
    if (campo === 'limiteInferior' || campo === 'limiteSuperior') {
      nuevosIntervalos[index].marcaClase =
        (nuevosIntervalos[index].limiteInferior +
          nuevosIntervalos[index].limiteSuperior) /
        2;
    }

    setDatosAgrupados({
      ...datosAgrupados,
      intervalos: nuevosIntervalos,
    });
  };

  const eliminarIntervalo = (index: number) => {
    const nuevosIntervalos = datosAgrupados.intervalos.filter(
      (_, i) => i !== index
    );
    setDatosAgrupados({
      ...datosAgrupados,
      intervalos: nuevosIntervalos,
    });
  };

  const handleCalcular = () => {
    if (tipoDatos === 'simples') {
      procesarDatosSimples();
    } else {
      procesarDatosAgrupados();
    }
    onCalcular();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Selector de tipo de datos */}
      <div>
        <label className="block text-sm sm:text-base font-semibold text-slate-700 mb-3">
          Tipo de Datos
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="simples"
              checked={tipoDatos === 'simples'}
              onChange={(e) => setTipoDatos(e.target.value as TipoDatos)}
              className="mr-2 text-blue-600"
            />
            <span className="text-gray-900 font-medium">Datos Simples</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="agrupados"
              checked={tipoDatos === 'agrupados'}
              onChange={(e) => setTipoDatos(e.target.value as TipoDatos)}
              className="mr-2 text-blue-600"
            />
            <span className="text-gray-900 font-medium">Datos Agrupados</span>
          </label>
        </div>
      </div>

      {/* Entrada de datos simples */}
      {tipoDatos === 'simples' && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-900">
            Ingresa los datos (separados por comas o espacios)
          </label>
          <textarea
            value={entradaTexto}
            onChange={(e) => setEntradaTexto(e.target.value)}
            placeholder="Ejemplo: 1, 2, 3, 4, 5 o 1 2 3 4 5"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            rows={4}
          />
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-600">
              Datos actuales:{' '}
              <span className="font-semibold text-gray-900">
                {datosSimples.valores.length}
              </span>{' '}
              valores
            </p>
            {entradaTexto && (
              <p className="text-gray-500">
                {entradaTexto.split(/[,\s]+/).filter((v) => v.trim()).length}{' '}
                valores detectados
              </p>
            )}
          </div>
        </div>
      )}

      {/* Entrada de datos agrupados */}
      {tipoDatos === 'agrupados' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              Ingresa los datos para generar intervalos automáticamente
            </label>
            <div className="flex space-x-4">
              <textarea
                value={entradaTexto}
                onChange={(e) => setEntradaTexto(e.target.value)}
                placeholder="Ejemplo: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                rows={3}
              />
              <div className="w-32">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Intervalos:
                </label>
                <input
                  type="number"
                  value={numeroIntervalos}
                  onChange={(e) =>
                    setNumeroIntervalos(parseInt(e.target.value) || 5)
                  }
                  min="2"
                  max="20"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Intervalos de Clase
              </h3>
              <button
                onClick={agregarIntervalo}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                + Agregar Intervalo
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {datosAgrupados.intervalos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No hay intervalos creados</p>
                </div>
              ) : (
                datosAgrupados.intervalos.map((intervalo, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                  >
                    <div className="grid grid-cols-5 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Límite Inf.
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={intervalo.limiteInferior || ''}
                          onChange={(e) =>
                            actualizarIntervalo(
                              index,
                              'limiteInferior',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Límite Sup.
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={intervalo.limiteSuperior || ''}
                          onChange={(e) =>
                            actualizarIntervalo(
                              index,
                              'limiteSuperior',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Marca de clase
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={intervalo.marcaClase || ''}
                          onChange={(e) =>
                            actualizarIntervalo(
                              index,
                              'marcaClase',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Frecuencia
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={intervalo.frecuencia || ''}
                          onChange={(e) =>
                            actualizarIntervalo(
                              index,
                              'frecuencia',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded text-gray-900"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => eliminarIntervalo(index)}
                          className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Botón de cálculo */}
      <div className="pt-4">
        <button
          onClick={handleCalcular}
          className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
        >
          Calcular Estadísticas
        </button>
      </div>
    </div>
  );
}
