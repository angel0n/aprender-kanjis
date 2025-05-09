export type Kanji = {
    _id: string,
    kanji: string,
    leitura: string,
    traducao: string
}

export type KanjisResponse = {
    dados: Kanji[];
  };
  