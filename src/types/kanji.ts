export type Kanji = {
    _id: string,
    kanji: string,
    leitura: string,
    traducao: string
}

export type KanjisResponse = {
    dados: Kanji[];
};

export type novoKanji = {
    codigo: string,
    kanji: string,
    leitura: string,
    traducao: string
} 