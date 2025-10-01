'use client';

import { useState } from 'react';
import { DatosSimples, DatosAgrupados, TipoDatos, ResultadosEstadisticos } from '../lib/types';
import { EstadisticasSimples, EstadisticasAgrupadas } from '../lib/estadisticas';
import { EntradaDatos } from './EntradaDatos';
import { ResultadosTabla } from './ResultadosTabla';
import { Graficos } from './Graficos';
import { MedidasTendenciaCentral } from './MedidasTendenciaCentral';
import { MedidasDispersion } from './MedidasDispersion';

export default function EstadisticaApp() {
  const [tipoDatos, setTipoDatos] = useState<TipoDatos>('simples');
  const [datosSimples, setDatosSimples] = useState<DatosSimples>({
    valores: [],
  });
  const [datosAgrupados, setDatosAgrupados] = useState<DatosAgrupados>({
    intervalos: [],
    amplitud: 0,
  });
  const [resultados, setResultados] = useState<ResultadosEstadisticos | null>(
    null
  );

  const calcularResultados = () => {
    if (tipoDatos === 'simples' && datosSimples.valores.length > 0) {
      const medidasTendenciaCentral = {
        media: EstadisticasSimples.calcularMedia(datosSimples.valores),
        mediana: EstadisticasSimples.calcularMediana(datosSimples.valores),
        moda: EstadisticasSimples.calcularModa(datosSimples.valores),
      };

      const medidasDispersion = {
        varianza: EstadisticasSimples.calcularVarianza(datosSimples.valores),
        desviacionEstandar: EstadisticasSimples.calcularDesviacionEstandar(
          datosSimples.valores
        ),
        rango: EstadisticasSimples.calcularRango(datosSimples.valores),
        coeficienteVariacion: EstadisticasSimples.calcularCoeficienteVariacion(
          datosSimples.valores
        ),
      };

      const tablaFrecuencias = EstadisticasSimples.generarTablaFrecuencias(
        datosSimples.valores
      );

      setResultados({
        medidasTendenciaCentral,
        medidasDispersion,
        tablaFrecuencias,
      });
    } else if (
      tipoDatos === 'agrupados' &&
      datosAgrupados.intervalos.length > 0
    ) {
      const medidasTendenciaCentral = {
        media: EstadisticasAgrupadas.calcularMedia(datosAgrupados),
        mediana: EstadisticasAgrupadas.calcularMediana(datosAgrupados),
        moda: [EstadisticasAgrupadas.calcularModa(datosAgrupados)],
      };

      const medidasDispersion = {
        varianza: EstadisticasAgrupadas.calcularVarianza(datosAgrupados),
        desviacionEstandar:
          EstadisticasAgrupadas.calcularDesviacionEstandar(datosAgrupados),
        rango: EstadisticasAgrupadas.calcularRango(datosAgrupados),
        coeficienteVariacion:
          EstadisticasAgrupadas.calcularCoeficienteVariacion(datosAgrupados),
      };

      // Generar tabla de frecuencias para datos agrupados
      const tablaFrecuencias = datosAgrupados.intervalos.map((intervalo) => ({
        valor: intervalo.marcaClase,
        frecuenciaAbsoluta: intervalo.frecuencia,
        frecuenciaRelativa: 0, // Se calculará después
        frecuenciaAcumulada: 0, // Se calculará después
        frecuenciaRelativaAcumulada: 0, // Se calculará después
      }));

      // Calcular frecuencias relativas y acumuladas
      const totalFrecuencias = tablaFrecuencias.reduce(
        (sum, item) => sum + item.frecuenciaAbsoluta,
        0
      );
      let frecuenciaAcumulada = 0;

      tablaFrecuencias.forEach((item) => {
        item.frecuenciaRelativa = item.frecuenciaAbsoluta / totalFrecuencias;
        frecuenciaAcumulada += item.frecuenciaAbsoluta;
        item.frecuenciaAcumulada = frecuenciaAcumulada;
        item.frecuenciaRelativaAcumulada =
          frecuenciaAcumulada / totalFrecuencias;
      });

      setResultados({
        medidasTendenciaCentral,
        medidasDispersion,
        tablaFrecuencias,
        datosAgrupados,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Calculadora de Estadística
          </h1>
          <p className="text-lg text-gray-600">
            Calcula medidas de tendencia central, dispersión y genera
            visualizaciones
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de entrada de datos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Entrada de Datos
            </h2>

            <EntradaDatos
              tipoDatos={tipoDatos}
              setTipoDatos={setTipoDatos}
              datosSimples={datosSimples}
              setDatosSimples={setDatosSimples}
              datosAgrupados={datosAgrupados}
              setDatosAgrupados={setDatosAgrupados}
              onCalcular={calcularResultados}
            />
          </div>

          {/* Panel de resultados */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Resultados
            </h2>

            {resultados ? (
              <div className="space-y-6">
                <MedidasTendenciaCentral
                  medidas={resultados.medidasTendenciaCentral}
                />
                <MedidasDispersion medidas={resultados.medidasDispersion} />
                <ResultadosTabla
                  tablaFrecuencias={resultados.tablaFrecuencias}
                  datosAgrupados={resultados.datosAgrupados}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Ingresa datos y presiona "Calcular" para ver los resultados
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sección de gráficos */}
        {resultados && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Visualizaciones
            </h2>
            <Graficos
              tablaFrecuencias={resultados.tablaFrecuencias}
              datosAgrupados={resultados.datosAgrupados}
              tipoDatos={tipoDatos}
            />
          </div>
        )}
      </div>
    </div>
  );
}
