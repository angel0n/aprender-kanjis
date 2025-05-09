'use client';

import { KanjisResponse } from '@/types/kanji';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useKanjis } from '@/providers/Kanjis';
import { useRouter } from 'next/navigation';

export default function KanjisPage() {
  const [kanjis, setKanjis] = useState<KanjisResponse['dados']>([]);
  const { selectedKanjis, setSelectedKanjis } = useKanjis();
  const router = useRouter();


  useEffect(() => {
    async function fetchKanjis() {
      const res = await fetch('/api/kanjis');
      const data: KanjisResponse = await res.json();
      setKanjis(data.dados);
    }

    fetchKanjis();
  }, []);

  const handleCheckboxChange = (kanji: string) => {
    const newSelectedKanjis = new Set(selectedKanjis);
    if (newSelectedKanjis.has(kanji)) {
      newSelectedKanjis.delete(kanji);
    } else {
      newSelectedKanjis.add(kanji);
    }
    setSelectedKanjis(newSelectedKanjis);
  };;

  const handleSelectAll = () => {
    let allKanjis: string[] = [];
    if(selectedKanjis.size != kanjis.length) allKanjis = kanjis.map(k => k._id);
    setSelectedKanjis(new Set(allKanjis));
  };

  const handleGoToSelectedPage = () => {
    if(selectedKanjis.size > 0) router.push(`/quiz`);
  };

  return (
    <main className="p-4">
      <div className='flex flex-row gap-2 p-4 items-center justify-center'>
        <Checkbox id="all"  className='cursor-pointer' checked={selectedKanjis.size == kanjis.length} onCheckedChange={() => handleSelectAll()} />
        <Label htmlFor="all" className='text-xl'>Selecionar tudo</Label>
        <Button className={`cursor-pointer ${selectedKanjis.size < 1 ? "opacity-20" : ""}`} variant="secondary" onClick={handleGoToSelectedPage}>Iniciar</Button>
      </div>
      <ScrollArea className="max-h-screen w-full rounded-md">
        <div className='h-full w-full flex flex-row flex-wrap gap-5 '>
          {kanjis.map((kanji) => (
            <Card key={kanji._id} className="w-[100px]">
              <CardHeader>
                <CardTitle className='flex justify-center items-center'>
                  <Checkbox className='cursor-pointer' checked={selectedKanjis.has(kanji._id)} onCheckedChange={() => handleCheckboxChange(kanji._id)} />
                </CardTitle>
              </CardHeader>
              <CardContent className='flex justify-center items-center'>
                <Label className='text-4xl'>{kanji.kanji}</Label>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </main>
  );
}
