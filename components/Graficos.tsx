'use client';

import { useState } from 'react';
import { FrecuenciaTabla, DatosAgrupados, TipoDatos } from '../lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  PieLabelRenderProps,
} from 'recharts';

interface GraficosProps {
  tablaFrecuencias: FrecuenciaTabla[];
  datosAgrupados?: DatosAgrupados;
  tipoDatos: TipoDatos;
}

const COLORS = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
];

export function Graficos({
  tablaFrecuencias,
  datosAgrupados,
  tipoDatos,
}: GraficosProps) {
  const [tipoGrafico, setTipoGrafico] = useState<
    'barras' | 'circular' | 'histograma'
  >('barras');

  if (tablaFrecuencias.length === 0) {
    return null;
  }

  // Preparar datos para los gráficos
  const datosGrafico = tablaFrecuencias.map((fila, index) => ({
    nombre:
      tipoDatos === 'agrupados' && datosAgrupados
        ? `[${datosAgrupados.intervalos[index]?.limiteInferior.toFixed(
            1
          )}-${datosAgrupados.intervalos[index]?.limiteSuperior.toFixed(1)})`
        : fila.valor.toFixed(1),
    valor: fila.frecuenciaAbsoluta,
    frecuenciaRelativa: fila.frecuenciaRelativa * 100,
    marcaClase:
      tipoDatos === 'agrupados' && datosAgrupados
        ? datosAgrupados.intervalos[index]?.marcaClase
        : fila.valor,
  }));

  const renderGraficoBarras = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={datosGrafico}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="nombre"
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
        />
        <YAxis />
        <Tooltip
          formatter={(value: number, name: string) => [
            value,
            name === 'valor'
              ? 'Frecuencia Absoluta'
              : 'Frecuencia Relativa (%)',
          ]}
          labelFormatter={(label) => `Intervalo: ${label}`}
        />
        <Bar dataKey="valor" fill="#3B82F6" name="Frecuencia Absoluta" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderGraficoCircular = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={datosGrafico}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(props: PieLabelRenderProps) => {
            // payload contiene la fila original del dataset
            const payload =
              (props.payload as Record<string, unknown> | undefined) ?? {};
            const nombre =
              (payload['nombre'] as string) ?? (props.name as string) ?? '';
            const frecuenciaRelativa = Number(
              payload['frecuenciaRelativa'] ?? props.value ?? 0
            );
            return `${nombre}: ${frecuenciaRelativa.toFixed(1)}%`;
          }}
          outerRadius={120}
          fill="#8884d8"
          dataKey="frecuenciaRelativa"
        >
          {datosGrafico.map((entry, _index) => (
            <Cell
              key={`cell-${_index}`}
              fill={COLORS[_index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [
            `${value.toFixed(2)}%`,
            'Frecuencia Relativa',
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderHistograma = () => {
    if (tipoDatos !== 'agrupados' || !datosAgrupados) {
      return (
        <div className="text-center text-gray-500 py-8">
          El histograma solo está disponible para datos agrupados
        </div>
      );
    }

    const datosHistograma = datosAgrupados.intervalos.map(
      (intervalo, index) => ({
        nombre: `[${intervalo.limiteInferior.toFixed(
          1
        )}-${intervalo.limiteSuperior.toFixed(1)})`,
        frecuencia: intervalo.frecuencia,
        densidad:
          intervalo.frecuencia /
          (intervalo.limiteSuperior - intervalo.limiteInferior),
        marcaClase: intervalo.marcaClase,
      })
    );

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={datosHistograma}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="nombre"
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
          />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => [
              value,
              name === 'frecuencia' ? 'Frecuencia' : 'Densidad',
            ]}
            labelFormatter={(label) => `Intervalo: ${label}`}
          />
          <Bar dataKey="frecuencia" fill="#10B981" name="Frecuencia" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      {/* Selector de tipo de gráfico */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setTipoGrafico('barras')}
          className={`px-4 py-2 rounded-lg font-medium ${
            tipoGrafico === 'barras'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Diagrama de Barras
        </button>
        <button
          onClick={() => setTipoGrafico('circular')}
          className={`px-4 py-2 rounded-lg font-medium ${
            tipoGrafico === 'circular'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Diagrama Circular
        </button>
        <button
          onClick={() => setTipoGrafico('histograma')}
          className={`px-4 py-2 rounded-lg font-medium ${
            tipoGrafico === 'histograma'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Histograma
        </button>
      </div>

      {/* Gráfico seleccionado */}
      <div className="bg-white rounded-lg p-6">
        {tipoGrafico === 'barras' && renderGraficoBarras()}
        {tipoGrafico === 'circular' && renderGraficoCircular()}
        {tipoGrafico === 'histograma' && renderHistograma()}
      </div>

      {/* Información adicional */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-bold text-gray-800 mb-3">
          Información del Gráfico
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="bg-white p-3 rounded-lg">
            <div className="font-semibold text-gray-700 mb-1">
              Total de datos
            </div>
            <div className="text-lg font-bold text-blue-600">
              {tablaFrecuencias.reduce(
                (sum, fila) => sum + fila.frecuenciaAbsoluta,
                0
              )}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="font-semibold text-gray-700 mb-1">
              Número de intervalos
            </div>
            <div className="text-lg font-bold text-green-600">
              {tablaFrecuencias.length}
            </div>
          </div>
          {tipoDatos === 'agrupados' && datosAgrupados && (
            <div className="bg-white p-3 rounded-lg">
              <div className="font-semibold text-gray-700 mb-1">
                Amplitud de clase
              </div>
              <div className="text-lg font-bold text-purple-600">
                {datosAgrupados.amplitud.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
