"use client";

import {CarouselComponent} from "@/components/Store/Carousel";
import {StoneCollection} from "@/components/Store/StoneCollection";
import {SeasonBoom} from "@/components/Store/SeasonBoom";
import Footer from "@/components/Store/Footer";
import Layout from "@/app/store/product/[productId]/layout";
import {Mountain, Rocket, SunSnow} from "lucide-react";
import data from "../../mock_data/data.json"

const Store = () => {

    return (
        <div>
            <Layout>
                <h1 className='text-3xl font-bold mt-10 ml-10 flex flex-row gap-2 items-center'>Our bestsellers <Rocket /></h1>
                <CarouselComponent items={data.filter(item => item.discount)}/>
                <div className='mt-20 bg-gray-50 py-10'>
                    <h1 className='text-3xl font-bold ml-10 flex flex-row gap-2 items-center'>Stone
                        collection <Mountain/></h1>
                    <StoneCollection/>
                </div>
                <h1 className='mt-20 text-3xl font-bold ml-10 flex flex-row gap-2 items-center'>Season Boom <SunSnow /></h1>
                <SeasonBoom/>
                <div className='sticky top-0  bg-white shadow-lg shadow-black/5 z-50'>
                    <Footer/>
                </div>
            </Layout>
        </div>
    );
};

export default Store;
