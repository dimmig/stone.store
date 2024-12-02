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

export const CarouselComponent = ({items}) => {
    const router = useRouter()
    return (
        <div className='flex justify-center px-20 mt-10'>
            <Carousel plugins={[
                Autoplay({
                    delay: 5000
                })
            ]} className='w-full'>
                <CarouselContent>
                    {items.map((item, index) => (
                        <CarouselItem
                            key={index}
                            className="md:basis-1/2 lg:basis-1/3"
                        >
                            <div className="p-1">
                                <Card className='w-[450px] h-[450px] p-20 relative shadow-md'>
                                    <CardContent
                                        className="flex flex-col aspect-square items-center justify-center p-6">
                                        <h2 className='absolute text-3xl top-5 left-5 font-bold'>{item.name}</h2>
                                        <div className='absolute top-16 left-5 flex row gap-2'>
                                            {item.sizes.map(size => (
                                                <Badge key={size + item.name} className='text-xs' variant='secondary'>
                                                    {size}
                                                </Badge>
                                            ))}
                                        </div>
                                        <Badge
                                            className='absolute text-lg top-5 right-5 font-bold'>{item.discount}%</Badge>
                                        <img className='select-none' src={item.defaultImage} width={400} height={400}
                                             alt={`Item ${index + 1}`}/>
                                        <Badge className='cross text-2xl font-bold absolute bottom-5 left-5'
                                               variant='secondary'>{item.price}$</Badge>
                                        <Badge className='text-2xl font-bold absolute bottom-5 left-28'>
                                            {item.price * (100 - item.discount) / 100}$
                                        </Badge>
                                        <Button variant="outline" size="icon" onClick={() => router.push(`/store/product/${item.id}`)}
                                                className='absolute text-lg bottom-5 right-5'>
                                            <ChevronRightIcon className="h-4 w-4"/>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious/>
                <CarouselNext/>
            </Carousel>
        </div>
    );
};

