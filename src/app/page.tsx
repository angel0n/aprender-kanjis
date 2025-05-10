'use client';

import { KanjisResponse, novoKanji } from '@/types/kanji';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useKanjis } from '@/providers/Kanjis';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

export default function KanjisPage() {
  const [kanjis, setKanjis] = useState<KanjisResponse['dados']>([]);
  const [novoKanji, setNovoKanji] = useState<novoKanji>({} as novoKanji)
  const [loading, setLoading] = useState<boolean>(true)
  const { selectedKanjis, setSelectedKanjis } = useKanjis();
  const router = useRouter();


  useEffect(() => {
    fetchKanjis();
  }, []);

  async function fetchKanjis() {
    setLoading(true)
    const res = await fetch('/api/kanjis');
    const data: KanjisResponse = await res.json();
    setKanjis(data.dados);
    setLoading(false)
  }

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
    if (selectedKanjis.size != kanjis.length) allKanjis = kanjis.map(k => k._id);
    setSelectedKanjis(new Set(allKanjis));
  };

  const handleGoToSelectedPage = () => {
    if (selectedKanjis.size > 0) router.push(`/quiz`);
  };

  const salvar = async () => {
    if (novoKanji.codigo != "日本") return
    await fetch('/api/kanjis/salvar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoKanji)
    });

    setNovoKanji({} as novoKanji)
    fetchKanjis();
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNovoKanji((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const baixarJson = () => {

    const blob = new Blob([JSON.stringify(kanjis, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "kanji.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="p-4">
      <div className='flex flex-row gap-2 p-4 items-center justify-center'>
        <Checkbox id="all" className='cursor-pointer' checked={selectedKanjis.size == kanjis.length} onCheckedChange={() => handleSelectAll()} />
        <Label htmlFor="all" className='text-xl'>Selecionar tudo</Label>
        <Button className={`cursor-pointer ${selectedKanjis.size < 1 ? "opacity-20" : ""}`} variant="secondary" onClick={handleGoToSelectedPage}>Iniciar</Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className='cursor-pointer' variant="secondary"><Plus /></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Novo Kanji</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="kanji" className="text-right">
                      Kanji
                    </Label>
                    <Input id="kanji" value={novoKanji?.kanji} onChange={handleChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="leitura" className="text-right">
                      Leitura
                    </Label>
                    <Input id="leitura" value={novoKanji?.leitura} onChange={handleChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="traducao" className="text-right">
                      Tradução
                    </Label>
                    <Input id="traducao" value={novoKanji?.traducao} onChange={handleChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="traducao" className="text-right">
                      codigo
                    </Label>
                    <Input id="codigo" value={novoKanji?.codigo} onChange={handleChange} className="col-span-3" />
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='cursor-pointer'>Cancelar</AlertDialogCancel>
              <AlertDialogAction className='cursor-pointer' onClick={salvar}>Salvar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
         <Button className='cursor-pointer' variant="secondary" onClick={baixarJson} disabled={loading}><Download /></Button>
      </div>
      {
        loading && <ScrollArea className="max-h-screen w-full rounded-md">
          <div className='h-full w-full flex flex-row flex-wrap gap-5 '>
            {Array.from({ length: 48 }).map((_, index) => (
              <Skeleton key={index} className="h-[100px] w-[100px] rounded-xl" />
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      }
      {!loading && <ScrollArea className="max-h-screen w-full rounded-md">
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
      </ScrollArea>}
    </main>
  );
}
