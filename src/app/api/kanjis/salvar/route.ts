import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";

export async function POST(request: Request) {
  const body = await request.json();
  const { kanji, leitura, traducao } = body;

  try {
    const client = await clientPromise;
    const db = client.db('kanjis');
    const collection = db.collection('kanjis');

    const result = await collection.insertOne({
      kanji,
      leitura,
      traducao,
    });

    return NextResponse.json({ message: 'Kanji salvo com sucesso!', id: result.insertedId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao salvar kanji' }, { status: 500 });
  }
}