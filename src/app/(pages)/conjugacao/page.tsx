'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function ConjugacaoPage() {
    const router = useRouter();

    const onclickBtnMasu= () => {
        router.push(`/conjugacao/masu`);
    };
    
    return (
        <main className="p-4 w-screen h-screen flex flex-row items-center justify-center gap-4">
            <Card className="w-[300px] h-[250px]" >
                <CardHeader>
                    <CardTitle>ます</CardTitle>
                    <CardDescription>Forma ます</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    Conjugue verbos na forma ます。
                </CardContent>
                <CardFooter>
                    <Button className="w-full cursor-pointer" onClick={onclickBtnMasu}>
                        Iniciar
                    </Button>
                </CardFooter>
            </Card>
        </main>
    )
}