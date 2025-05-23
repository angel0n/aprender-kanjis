export type conjugacao = {
    _id: string,
    dicionario: string,
    leitura: string,
    conjugado: string
    forma: string
}

export type conjugacaoResponse = {
    dados: conjugacao[];
};