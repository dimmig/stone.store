import * as React from "react"

import {
    Carousel, CarouselContent,
    CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel"
import {Card, CardContent} from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay"
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {ChevronRightIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import Image from "next/image";

export const CarouselComponent = ({items}) => {
    const router = useRouter()

    return (
        <div className="w-full">
            <Carousel>
                <CarouselContent>
                    {items.map((item, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                                        <h2 className="absolute text-3xl top-5 left-5 font-bold">{item.name}</h2>
                                        <div className="absolute top-16 left-5 flex row gap-2">
                                            {item.sizes.map(size => (
                                                <Badge key={size + item.name} className="text-xs" variant="secondary">
                                                    {size}
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={item.images[0]}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <Badge className="text-2xl font-bold absolute bottom-5 left-5">
                                            ${item.price}
                                        </Badge>
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            onClick={() => router.push(`/store/product/${item.id}`)}
                                            className="absolute text-lg bottom-5 right-5"
                                        >
                                            <ChevronRightIcon className="h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};