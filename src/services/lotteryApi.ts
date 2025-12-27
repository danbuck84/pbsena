export interface MegaSenaResult {
    numero: number;
    dataApuracao: string;
    dataProximoConcurso: string;
    valorEstimadoProximoConcurso: number;
    dezenas: string[];
    acumulado: boolean;
    listaRateioPremio: Array<{
        faixa: string;
        numeroDeGanhadores: number;
        valorPremio: number;
        descricaoFaixa: string;
    }>;
}

export const fetchLatestResult = async (): Promise<MegaSenaResult | null> => {
    try {
        const response = await fetch('https://api.guidi.dev.br/loteria/megasena/ultimo');
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching lottery result:", error);
        return null;
    }
};
