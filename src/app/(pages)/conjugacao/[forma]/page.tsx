'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { conjugacao, conjugacaoResponse } from "@/types/conjugacao";
import { ArrowLeft, Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function conjugacaoQuizPage() {
    const params = useParams();
    const router = useRouter()

    const forma = params.forma;

    const [verbos, setVerbos] = useState<conjugacao[]>([])
    const [verbosErrados, setVerbosErrados] = useState<conjugacao[]>([])
    const [kanjiAtual, setKanjiAtual] = useState(0)
    const [loading, setLoading] = useState(true)

    const inputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef(null);


    useEffect(() => {
        async function fetchVerbos() {
            setLoading(true)
            const res = await fetch('/api/conjugacao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ forma: forma })
            });

            const data: conjugacaoResponse = await res.json();

            setVerbos(data.dados);
            setLoading(false)
        }

        fetchVerbos();
    }, [])

    useEffect(() => {
        if (!scrollAreaRef.current) return;
        //@ts-ignore
        const viewport = scrollAreaRef.current.querySelector(
            "[data-radix-scroll-area-viewport]"
        );

        if (!viewport) return;

        const cards = viewport.querySelectorAll(".kanji-card");
        const currentCard = cards[kanjiAtual];

        if (currentCard) {
            const viewportWidth = viewport.offsetWidth;
            const cardLeft = currentCard.offsetLeft;
            const cardWidth = currentCard.offsetWidth;

            const scrollLeft = cardLeft - (viewportWidth / 2) + (cardWidth / 2);

            viewport.scrollTo({
                left: scrollLeft,
                behavior: "smooth",
            });
        }
    }, [kanjiAtual]);

    const valida = () => {
        if (inputRef.current != null) {
            const kanji = verbos[kanjiAtual]
            if(kanji == null) return
            const valor = inputRef.current.value;
            if (kanji.conjugado != valor) {
                setVerbosErrados(prev => [...prev, kanji])
            }
            setKanjiAtual(prev => prev + 1)
            inputRef.current.value = ""
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            valida()
        }
    };

    const voltar = () => {
        router.push(`/`);
    }

    return (
        <main>
            {
                loading && <ScrollArea className="h-[150px] w-full p-4 rounded-md border" ref={scrollAreaRef}>
                    <div className="flex flex-row gap-5">
                        {Array.from({ length: 48 }).map((_, index) => (
                            <Skeleton key={index} className="h-[100px] w-[100px] rounded-xl" />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            }
            {
                !loading && <ScrollArea className="h-[150px] w-full p-4 rounded-md border" ref={scrollAreaRef}>
                    <div className="flex flex-row gap-5">
                        {verbos.map((verbos, index) => (
                            <Card
                                key={index}
                                className={`kanji-card ${index !== kanjiAtual ? "opacity-15" : ""
                                    } ${verbosErrados.includes(verbos)
                                        ? "bg-red-500"
                                        : kanjiAtual > index
                                            ? "bg-green-500"
                                            : ""
                                    }`}
                            >
                                <CardContent className="flex flex-col justify-center items-center">
                                    <Label className="text-4xl">{verbos.dicionario}</Label>
                                    <Label>{verbos.leitura}</Label>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            }
            <div className="flex flex-col items-center justify-center w-full">
                <div className="flex w-full  items-center justify-center space-x-2 mt-10">
                    <Button className="h-12 cursor-pointer" variant="outline" onClick={voltar} disabled={loading}><ArrowLeft /></Button>
                    <Input className="h-12 w-50" ref={inputRef} onKeyDown={handleKeyDown} />
                    <Button className="h-12 cursor-pointer" variant="outline" onClick={valida} disabled={loading}><Check /></Button>
                </div>
            </div>
        </main>
    )
}