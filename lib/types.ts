// Tipos para la aplicación de estadística

export interface DatosSimples {
    valores: number[];
}

export interface IntervaloClase {
    limiteInferior: number;
    limiteSuperior: number;
    marcaClase: number;
    frecuencia: number;
}

export interface DatosAgrupados {
    intervalos: IntervaloClase[];
    amplitud: number;
}

export interface FrecuenciaTabla {
    valor: number;
    frecuenciaAbsoluta: number;
    frecuenciaRelativa: number;
    frecuenciaAcumulada: number;
    frecuenciaRelativaAcumulada: number;
}

export interface MedidasTendenciaCentral {
    media: number;
    mediana: number;
    moda: number[];
}

export interface MedidasDispersion {
    varianza: number;
    desviacionEstandar: number;
    rango: number;
    coeficienteVariacion: number;
}

export interface ResultadosEstadisticos {
    medidasTendenciaCentral: MedidasTendenciaCentral;
    medidasDispersion: MedidasDispersion;
    tablaFrecuencias: FrecuenciaTabla[];
    datosAgrupados?: DatosAgrupados;
}

export type TipoDatos = 'simples' | 'agrupados';
