import { NextRequest, NextResponse } from 'next/server';
import { Document, ObjectId } from 'mongodb';
import clientPromise from '../../../../../lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('kanjis');
    const colecao = db.collection<Document>('kanjis');

    const resultado = await colecao.find({}).toArray();

    return NextResponse.json({ dados: resultado });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ dados: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json(); // espera { ids: ["id1", "id2"] }

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Lista de ids inválida' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('kanjis'); // substitua pelo nome do seu banco
    const collection = db.collection('kanjis');

    const objectIds = ids.map(id => new ObjectId(id));

    const resultado = await collection.find({ _id: { $in: objectIds } }).toArray();

    return NextResponse.json({ dados: resultado });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar kanjis' }, { status: 500 });
  }
}