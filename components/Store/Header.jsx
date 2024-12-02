import React from "react";
import Image from "next/image";
import {ArrowRight, Heart, Search, ShoppingCart, User} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

export const Header = ({ className }) => {
 return (
     <div className={cn("flex flex-row items-center px-20 border-b-2 border-b-gray-100", className)}>
             <Image
                 src="/assets/icons/app-logo.svg"
                 width={200}
                 height={60}
                 className="pointer-events-none mt-3"
                 alt="app-logo"
             />
             <Search className='ml-10 h-5 text-gray-400 '/>
             <Input className='w-[50%] ml-2 rounded-2xl outline-none bg-gray-50 pl-11' type='Search'
                    placeholder="Search"/>
             <Button variant='outline' className='ml-24 gap-2'>
                 <User size={16}/>
                 Log in
             </Button>
         <Button variant="outline" size="icon" className='text-lg ml-5'>
             <Heart className="h-4 w-4"/>
         </Button>
             <Button className='group relative ml-5'>
                 <b>120$</b>
                 <span className='h-full w-[1px] bg-white/30 mx-3'/>
                 <div className='flex items-center gap-1 transition duration-300 group-hover:opacity-0'>
                     <ShoppingCart className='h-4 w-4 relative' strokeWidth={2}/>
                     <b>2</b>
                 </div>
                 <ArrowRight
                     className='w-5 absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:-translate-x-0'/>
             </Button>
     </div>
 );
};