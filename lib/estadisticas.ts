import { DatosAgrupados, FrecuenciaTabla, IntervaloClase } from './types';

// Cálculos para datos simples
export class EstadisticasSimples {
    static calcularMedia(datos: number[]): number {
        if (datos.length === 0) return 0;
        return datos.reduce((sum, valor) => sum + valor, 0) / datos.length;
    }

    static calcularMediana(datos: number[]): number {
        if (datos.length === 0) return 0;
        const datosOrdenados = [...datos].sort((a, b) => a - b);
        const n = datosOrdenados.length;

        if (n % 2 === 0) {
            return (datosOrdenados[n / 2 - 1] + datosOrdenados[n / 2]) / 2;
        } else {
            return datosOrdenados[Math.floor(n / 2)];
        }
    }

    static calcularModa(datos: number[]): number[] {
        if (datos.length === 0) return [];

        const frecuencias = new Map<number, number>();
        datos.forEach(valor => {
            frecuencias.set(valor, (frecuencias.get(valor) || 0) + 1);
        });

        const maxFrecuencia = Math.max(...frecuencias.values());
        const modas = Array.from(frecuencias.entries())
            .filter(([, freq]) => freq === maxFrecuencia)
            .map(([valor]) => valor);

        return modas;
    }

    static calcularVarianza(datos: number[]): number {
        if (datos.length === 0) return 0;
        const media = this.calcularMedia(datos);
        const sumaCuadrados = datos.reduce((sum, valor) => sum + Math.pow(valor - media, 2), 0);
        return sumaCuadrados / (datos.length - 1);
    }

    static calcularDesviacionEstandar(datos: number[]): number {
        return Math.sqrt(this.calcularVarianza(datos));
    }

    static calcularRango(datos: number[]): number {
        if (datos.length === 0) return 0;
        return Math.max(...datos) - Math.min(...datos);
    }

    static calcularCoeficienteVariacion(datos: number[]): number {
        const media = this.calcularMedia(datos);
        if (media === 0) return 0;
        return (this.calcularDesviacionEstandar(datos) / media) * 100;
    }

    static generarTablaFrecuencias(datos: number[]): FrecuenciaTabla[] {
        const frecuencias = new Map<number, number>();
        datos.forEach(valor => {
            frecuencias.set(valor, (frecuencias.get(valor) || 0) + 1);
        });

        const tabla: FrecuenciaTabla[] = [];
        let frecuenciaAcumulada = 0;
        const totalDatos = datos.length;

        Array.from(frecuencias.entries())
            .sort(([a], [b]) => a - b)
            .forEach(([valor, frecuenciaAbsoluta]) => {
                frecuenciaAcumulada += frecuenciaAbsoluta;
                const frecuenciaRelativa = frecuenciaAbsoluta / totalDatos;
                const frecuenciaRelativaAcumulada = frecuenciaAcumulada / totalDatos;

                tabla.push({
                    valor,
                    frecuenciaAbsoluta,
                    frecuenciaRelativa,
                    frecuenciaAcumulada,
                    frecuenciaRelativaAcumulada
                });
            });

        return tabla;
    }
}

// Cálculos para datos agrupados
export class EstadisticasAgrupadas {
    static calcularMedia(datosAgrupados: DatosAgrupados): number {
        const { intervalos } = datosAgrupados;
        const sumaProductos = intervalos.reduce((sum, intervalo) =>
            sum + (intervalo.marcaClase * intervalo.frecuencia), 0);
        const totalFrecuencias = intervalos.reduce((sum, intervalo) =>
            sum + intervalo.frecuencia, 0);

        return totalFrecuencias > 0 ? sumaProductos / totalFrecuencias : 0;
    }

    static calcularMediana(datosAgrupados: DatosAgrupados): number {
        const { intervalos } = datosAgrupados;
        const totalFrecuencias = intervalos.reduce((sum, intervalo) =>
            sum + intervalo.frecuencia, 0);
        const posicionMediana = totalFrecuencias / 2;

        let frecuenciaAcumulada = 0;
        let intervaloMediana: IntervaloClase | null = null;

        for (const intervalo of intervalos) {
            frecuenciaAcumulada += intervalo.frecuencia;
            if (frecuenciaAcumulada >= posicionMediana) {
                intervaloMediana = intervalo;
                break;
            }
        }

        if (!intervaloMediana) return 0;

        const frecuenciaAcumuladaAnterior = frecuenciaAcumulada - intervaloMediana.frecuencia;
        const amplitud = intervaloMediana.limiteSuperior - intervaloMediana.limiteInferior;

        return intervaloMediana.limiteInferior +
            ((posicionMediana - frecuenciaAcumuladaAnterior) / intervaloMediana.frecuencia) * amplitud;
    }

    static calcularModa(datosAgrupados: DatosAgrupados): number {
        const { intervalos } = datosAgrupados;
        const intervaloModa = intervalos.reduce((max, intervalo) =>
            intervalo.frecuencia > max.frecuencia ? intervalo : max);

        const indiceModa = intervalos.indexOf(intervaloModa);
        const amplitud = intervaloModa.limiteSuperior - intervaloModa.limiteInferior;

        let frecuenciaAnterior = 0;
        let frecuenciaPosterior = 0;

        if (indiceModa > 0) {
            frecuenciaAnterior = intervalos[indiceModa - 1].frecuencia;
        }
        if (indiceModa < intervalos.length - 1) {
            frecuenciaPosterior = intervalos[indiceModa + 1].frecuencia;
        }

        const delta1 = intervaloModa.frecuencia - frecuenciaAnterior;
        const delta2 = intervaloModa.frecuencia - frecuenciaPosterior;

        return intervaloModa.limiteInferior + (delta1 / (delta1 + delta2)) * amplitud;
    }

    static calcularVarianza(datosAgrupados: DatosAgrupados): number {
        const media = this.calcularMedia(datosAgrupados);
        const { intervalos } = datosAgrupados;

        const sumaProductos = intervalos.reduce((sum, intervalo) =>
            sum + (Math.pow(intervalo.marcaClase - media, 2) * intervalo.frecuencia), 0);
        const totalFrecuencias = intervalos.reduce((sum, intervalo) =>
            sum + intervalo.frecuencia, 0);

        return totalFrecuencias > 1 ? sumaProductos / (totalFrecuencias - 1) : 0;
    }

    static calcularDesviacionEstandar(datosAgrupados: DatosAgrupados): number {
        return Math.sqrt(this.calcularVarianza(datosAgrupados));
    }

    static calcularRango(datosAgrupados: DatosAgrupados): number {
        const { intervalos } = datosAgrupados;
        if (intervalos.length === 0) return 0;

        const limiteInferior = Math.min(...intervalos.map(i => i.limiteInferior));
        const limiteSuperior = Math.max(...intervalos.map(i => i.limiteSuperior));

        return limiteSuperior - limiteInferior;
    }

    static calcularCoeficienteVariacion(datosAgrupados: DatosAgrupados): number {
        const media = this.calcularMedia(datosAgrupados);
        if (media === 0) return 0;
        return (this.calcularDesviacionEstandar(datosAgrupados) / media) * 100;
    }

    static generarIntervalos(datos: number[], numeroIntervalos: number): IntervaloClase[] {
        if (datos.length === 0) return [];

        const min = Math.min(...datos);
        const max = Math.max(...datos);
        const amplitud = (max - min) / numeroIntervalos;

        const intervalos: IntervaloClase[] = [];

        for (let i = 0; i < numeroIntervalos; i++) {
            const limiteInferior = min + (i * amplitud);
            const limiteSuperior = min + ((i + 1) * amplitud);
            const marcaClase = (limiteInferior + limiteSuperior) / 2;

            const frecuencia = datos.filter(valor =>
                valor >= limiteInferior && valor < limiteSuperior
            ).length;

            intervalos.push({
                limiteInferior,
                limiteSuperior,
                marcaClase,
                frecuencia
            });
        }

        return intervalos;
    }
}
