"use client"
import {useEffect, useState} from "react";
import {Spinner} from '@/components/ui/spinner';
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {NotebookPen} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import Footer from "@/components/Store/Footer";
import {SimilarProducts} from "@/components/Store/SimilarProducts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Image from "next/image";

const BuyProduct = ({params}) => {
    const [currentItem, setCurrentItem] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedColor, setSelectedColor] = useState(null)
    const [loadingImages, setLoadingImages] = useState({})

    useEffect(() => {
        setHydrated(true)
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${params.productId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await response.json();
                setCurrentItem(data)
                if (data.colors && data.colors.length > 0) {
                    setSelectedColor(data.colors[0])
                }
                // Initialize loading state for all images
                const initialLoadingState = {};
                data.images.forEach(img => {
                    initialLoadingState[img] = true;
                    data.colors.forEach(color => {
                        initialLoadingState[`${img}-${color}`] = true;
                    });
                });
                setLoadingImages(initialLoadingState);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [params.productId]);

    const handleImageLoad = (imageUrl) => {
        setLoadingImages(prev => ({
            ...prev,
            [imageUrl]: false
        }));
    };

    if (!currentItem || !hydrated) {
        return (
            <div className='mt-[20%] flex flex-col items-center justify-center gap-4'>
                <Spinner/>
                <p className="text-sm text-gray-500">Loading product...</p>
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
                    {currentItem.colors.map(color => (
                        <Card
                            key={color}
                            className={`w-[150px] h-[150px] flex justify-center items-center relative shadow-md hover:cursor-pointer ${
                                selectedColor === color ? "border border-black" : ""
                            }`}
                            onClick={() => setSelectedColor(color)}
                        >
                            <CardContent className='p-0'>
                                <div className="relative w-full h-full">
                                    {loadingImages[`${currentItem.images[0]}-${color}`] && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                            <Spinner className="h-6 w-6"/>
                                        </div>
                                    )}
                                    <Image
                                        src={currentItem.images[0]}
                                        alt={`${currentItem.name} - ${color}`}
                                        fill
                                        className="object-cover"
                                        onLoad={() => handleImageLoad(`${currentItem.images[0]}-${color}`)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
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

                    <div className="relative w-full h-full">
                        {loadingImages[currentItem.images[0]] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <Spinner className="h-8 w-8"/>
                            </div>
                        )}
                        <Image
                            src={currentItem.images[0]}
                            alt={currentItem.name}
                            fill
                            className="object-contain"
                            onLoad={() => handleImageLoad(currentItem.images[0])}
                        />
                    </div>
                </div>
            </div>
            <div className="mr-20">
                <div className="flex flex-row gap-5 items-center  border-b-2 border-gray-100">
                    <NotebookPen/>
                    <h2 className="text-3xl">
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
                        <Select onValueChange={setSelectedSize}>
                            <SelectTrigger className="flex flex-1">
                                <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                                {currentItem.sizes.map(size => (
                                    <SelectItem
                                        key={size}
                                        value={size}
                                        className='text-xl px-10 hover:cursor-pointer'
                                    >
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-900">
                        ${currentItem.price.toLocaleString()}
                    </span>
                </div>
                <div className="relative flex flex-row flex-between gap-5">
                    <Button
                        className="w-[200px] font-bold text-3xl mt-5 rounded-sm flex-center bg-black"
                    >
                        Add to Cart
                    </Button>
                    <Badge
                        className={`${currentItem.discount ? "" : "w-[200px]"} px-10 font-bold  text-3xl mt-5 rounded-sm flex-center`}
                        variant='secondary'
                    >
                        {currentItem.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                </div>
            </div>
            <SimilarProducts currentItem={currentItem}/>
            <Footer/>
        </div>
    );
}

export default BuyProduct