import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';


export async function POST(req: NextRequest) {
  try {
    const { forma } = await req.json(); 

    const client = await clientPromise;
    const db = client.db('kanjis'); 
    const collection = db.collection('conjugacao');

    const resultado = await collection.find({ forma: "masu" }).toArray();

    return NextResponse.json({ dados: resultado });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar kanjis' }, { status: 500 });
  }
}