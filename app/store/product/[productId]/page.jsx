"use client"
import {useEffect, useState} from "react";
import data from "../../../../mock_data/data.json"
import {Spinner} from '@/components/ui/spinner';
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {NotebookPen} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import Footer from "@/components/Store/Footer";
import {SimilarProducts} from "@/components/Store/SimilarProducts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const BuyProduct = ({params}) => {
    const [currentItem, setCurrentItem] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedItemVariation, setSelectedItemVariation] = useState(currentItem ? currentItem.image[currentItem.colors[0]] : "")

    useEffect(() => {
        setHydrated(true)
    }, []);

    useEffect(() => {
        const item = data.find(it => it.id === params.productId)
        if (item) {
            setCurrentItem(item)
        }
    }, [params.productId]);

    if (!currentItem || !hydrated) {
        return (
            <div className='mt-[20%]'>
                <Spinner/>
            </div>
        );
    }

    return (
        <div className={`h-[100%] w-[100%] transition all duration-300`} id="main">
            <div className="flex flex-center">
                <div className="flex flex-col items-start w-max">
                    <h1
                        className="text-5xl font-bold tracking-wide text-center mt-10"
                        id="text-data"
                    >
                        {currentItem.name}
                    </h1>
                    <p className=" text-2xl font-thin mt-2" id="text-data">
                        Model: {currentItem.model}
                    </p>
                </div>
            </div>

            <div className="main-info flex flex-row justify-around mt-32 pb-16">
                <div className='flex flex-row pl-10'>
                    <div className='flex flex-col gap-2'>
                        {currentItem.colors.map(color =>
                            <Card
                                key={color}
                                className={`w-[150px] h-[150px] flex justify-center items-center relative shadow-md hover:cursor-pointer${selectedItemVariation === currentItem.image[color] ? "border border-black" : ""}`}
                                onClick={() => setSelectedItemVariation(currentItem.image[color])}
                            >
                                <CardContent className='p-0'>
                                    <img src={currentItem.image[color]} width={100} height={100}/>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <div className="flex justify-center items-center relative p-10 pr-20 pl-48 rounded-sm pt-0"
                         id="img-bg">
                        {currentItem.discount && (

                            <div
                                className="absolute flex-center right-0 top-0 w-[100px] h-[40px] "
                                id="discount"
                            >
                                <Badge className="text-xl font-bold ">
                                    -{currentItem.discount}%
                                </Badge>
                            </div>
                        )}

                        <img
                            src={selectedItemVariation === "" ? currentItem.image[currentItem.colors[0]] : selectedItemVariation}
                            width={currentItem.width * 1.8}
                            height={currentItem.height}
                            id="item-image"
                            alt={currentItem.name}
                        />
                    </div>
                </div>
                <div className="mr-20">
                    <div className="flex flex-row gap-5 items-center  border-b-2 border-gray-100">
                        <NotebookPen/>
                        <h2
                            className="text-3xl">
                            Product information
                        </h2>
                    </div>
                    <div>
                        <div className="mt-10 mb-4 rounded-sm bg-gray-100 p-5" id="description-bg">
                            <p className="text-lg w-[420px]" id="text-data">
                                {currentItem.description}
                            </p>
                        </div>
                        <div className="mb-4">
                            <Select>
                                <SelectTrigger className="flex flex-1">
                                    <SelectValue placeholder="Sizes"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {currentItem.sizes.map(size => (
                                        <SelectItem
                                            className='text-xl px-10 hover:cursor-pointer'
                                            value={size}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="relative flex flex-row flex-between gap-5">
                        <Button
                            className={`py-5 px-3 ${currentItem.discount ? "w-[150px]" : "w-[200px]"} font-bold  text-3xl mt-5 rounded-sm flex-center  bg-black`}
                        >
                            Buy
                        </Button>
                        {currentItem.discount && (
                            <div
                                className="opacity-20 cross text-3xl top-6 left-[46%]"
                            >
                                {currentItem.price * (currentItem.discount / 100) + currentItem.price} $
                            </div>
                        )}
                        <Badge
                            className={`${currentItem.discount ? "" : "w-[200px]"} px-10 font-bold  text-3xl mt-5 rounded-sm flex-center`}
                            variant='secondary'
                        >
                            {currentItem.price} $
                        </Badge>
                    </div>
                </div>
            </div>
            <SimilarProducts currentItem={currentItem}/>
            <Footer/>
        </div>
    );
}

export default BuyProduct