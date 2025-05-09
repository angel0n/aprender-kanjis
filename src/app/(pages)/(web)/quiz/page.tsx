'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useKanjis } from "@/providers/Kanjis";
import { KanjisResponse } from "@/types/kanji";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function QuizPage() {
    const { selectedKanjis } = useKanjis();
    const [kanjis, setKanjis] = useState<KanjisResponse['dados']>([]);
    const [kanjisErrados, setKanjisErrados] = useState<KanjisResponse['dados']>([]);
    const [kanjiAtual, setKanjiAtual] = useState(0)

    const inputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef(null);

    useEffect(() => {
        async function fetchKanjisSelecionados() {
            const res = await fetch('/api/kanjis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: Array.from(selectedKanjis) })
            });

            const data: KanjisResponse = await res.json();

            setKanjis(data.dados);
        }

        fetchKanjisSelecionados();
    }, []);

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            valida()
        }
    };

    const valida = () => {
        if (inputRef.current != null) {
            const valor = inputRef.current.value;

            const kanji = kanjis[kanjiAtual]
            if (kanji.traducao.toLowerCase() != valor.toLowerCase()) {
                setKanjisErrados(prev => [...prev, kanji])
            }

            setKanjiAtual(prev => prev + 1)
            inputRef.current.value = ""
        }
    }

    return (
        <>
            <ScrollArea className="h-[150px] w-full p-4 rounded-md border" ref={scrollAreaRef}>
                <div className="flex flex-row gap-5">
                    {kanjis.map((kanji, index) => (
                        <Card
                            key={index}
                            className={`kanji-card w-[100px] ${index !== kanjiAtual ? "opacity-15" : ""
                                } ${kanjisErrados.includes(kanji)
                                    ? "bg-red-500"
                                    : kanjiAtual > index
                                        ? "bg-green-500"
                                        : ""
                                }`}
                        >
                            <CardContent className="flex justify-center items-center">
                                <Label className="text-4xl">{kanji.kanji}</Label>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <div className="flex w-full  items-center justify-center space-x-2 mt-10">
                <Input className="h-12 w-50" ref={inputRef} onKeyDown={handleKeyDown} />
                <Button className="h-12 cursor-pointer" variant="outline" onClick={valida}><Check /></Button>
            </div>
        </>
    )
}