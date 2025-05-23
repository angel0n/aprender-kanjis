'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, Check } from "lucide-react";
import { useRouter } from "next/navigation";



export default function KanjisPage() {
  const router = useRouter();

  function onClickBtnKanji() {
    router.push("/kanjis/quiz")
  }

  function onClickBtnConjugacao() {
    router.push("/conjugacao")
  }

  return (
    <main className="p-4 w-screen h-screen flex flex-row items-center justify-center gap-4">
      <Card className="w-[300px] h-[250px]" >
        <CardHeader>
          <CardTitle>Kanji</CardTitle>
          <CardDescription>Aprender kanis</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          Aprenda kanjis com um quiz, adivinhando a tradução ou leitura.
        </CardContent>
        <CardFooter>
          <Button className="w-full cursor-pointer" onClick={onClickBtnKanji}>
            Acessar
          </Button>
        </CardFooter>
      </Card>
      <Card className="w-[300px] h-[250px]">
        <CardHeader>
          <CardTitle>Vocabulario</CardTitle>
          <CardDescription>Aprender Vocabulario</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          Aprenda vocabularios gerais ou divididos por topico
        </CardContent>
        <CardFooter>
          <Button className="w-full cursor-pointer" disabled>
            Acessar
          </Button>
        </CardFooter>
      </Card>
      <Card className="w-[300px] h-[250px]" >
        <CardHeader>
          <CardTitle>Conjugação</CardTitle>
          <CardDescription>Conjugue verbos</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          Identifique e conjulgue verbos
        </CardContent>
        <CardFooter className="h-full">
          <Button className="w-full cursor-pointer" onClick={onClickBtnConjugacao}>
            Acessar
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
