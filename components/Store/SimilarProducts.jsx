import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import data from "@/mock_data/data.json";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {ChevronRightIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";

export const SimilarProducts = ({className, currentItem}) => {
    const router = useRouter()
    return (
        <div className={cn("mt-10 px-20", className)}>
            <h1 className='mb-10 text-3xl font-bold'>Similar products</h1>
                <Carousel>
                    <CarouselContent>
                        {data.filter(it => it.id !== currentItem.id).map((item) => (
                            <CarouselItem
                                key={item.id}
                                className="md:basis-1/2 lg:basis-1/3"
                            >
                                <Card className='w-[450px] h-[450px] p-20 relative'>
                                    <CardContent
                                        className="flex flex-col aspect-square items-center justify-center p-6">
                                        <h2 className='absolute text-3xl top-5 left-5 font-bold'>{item.name}</h2>
                                        <div className='absolute top-16 left-5 flex row gap-2'>
                                            {item.sizes.map(size => (
                                                <Badge key={size + item.name} className='text-xs'
                                                       variant='secondary'>
                                                    {size}
                                                </Badge>
                                            ))}
                                        </div>
                                        <img className='select-none' src={item.defaultImage} width={item.width}
                                             height={item.height}
                                             alt={`Item-${item.id}`}/>
                                        <Badge
                                            className='text-2xl font-bold absolute bottom-5 left-10 bg-white px-5 py-2 bg-black'>
                                            {item.price}$
                                        </Badge>
                                        <Button onClick={() => router.push(`/store/product/${item.id}`)}
                                                variant="outline" size="icon"
                                                className='absolute text-lg bottom-5 right-5'>
                                            <ChevronRightIcon className="h-4 w-4"/>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>
        </div>
    )
}