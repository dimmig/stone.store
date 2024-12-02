import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {ChevronRightIcon} from "lucide-react";
import * as React from "react";
import data from "../../mock_data/data.json"
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";

export const SeasonBoom = ({ className }) => {
    const router = useRouter()
    return (
        <div className={cn("grid grid-cols-3 mt-10 px-20 gap-5", className)}>
        {data.map((item) => (
                    <div className="p-1" key={item.id}>
                        <Card className='w-[450px] h-[450px] p-20 relative shadow-md rounded-none'>
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
                                <img className='select-none' src={item.defaultImage} width={item.width} height={item.height}
                                     alt={`Item ${item.id}`}/>
                                <Badge variant="outline" className='text-2xl font-bold absolute bottom-5 left-5 px-5 py-2'>{item.price}$</Badge>
                                <Button
                                    onClick={() => router.push(`/store/product/${item.id}`)}
                                        className='absolute text-lg bottom-5 right-5'>
                                    Buy <ChevronRightIcon className="h-4 w-4"/>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
            ))}
        </div>
    )
}