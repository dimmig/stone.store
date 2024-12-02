"use client"

import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem, NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {kidsCategories, menCategories, womenCategories} from "@/utils/menuConstants";
import {cn} from "@/lib/utils";
import {forwardRef, useState} from "react";
import {Baby, Calculator, Flower, Logs, PencilRuler, Shirt} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {PriceChart} from "@/components/Store/PriceChart";
import {PriceSlider} from "@/components/Store/PriceSlider";
import {Checkbox} from "@/components/ui/checkbox";
import {FilterCheckbox} from "@/components/Store/Checkbox";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export const Menu = ({className}) => {
    const [priceFrom, setPriceFrom] = useState(0)
    const [priceTo, setPriceTo] = useState(1000)

    const handlePriceFromInputChange = e => {
        if (typeof e === "number") {
            setPriceFrom(e)
        } else {
            setPriceFrom(e.target.value)
        }
    }

    const handlePriceToInputChange = e => {
        if (typeof e === "number") {
            setPriceTo(e)
        } else {
            setPriceTo(e.target.value)
        }
    }

    return (
        <div className={cn('flex justify-between shadow-md shadow-grey-200  p-7', className)}>
            <div className='flex justify-start items-center'>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className='text-xl'>Men</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 md:w-[600px] lg:grid-flow-col lg:auto-cols-fr lg:grid-rows-6">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <div
                                                className="flex h-full w-full select-none flex-col flex-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                                                <Shirt strokeWidth={1} size={100}/>
                                                <p className="mt-10 text-sm leading-tight text-muted-foreground">
                                                    Explore the latest men's fashion, from classic styles to modern
                                                    trends.
                                                </p>
                                            </div>
                                        </NavigationMenuLink>
                                    </li>
                                    {menCategories.map((component) => (
                                        <ListItem
                                            key={component.title}
                                            title={component.title}
                                            href={component.href}
                                        >
                                            {component.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className='text-xl'>Women</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 md:w-[600px] lg:grid-flow-col lg:auto-cols-fr lg:grid-rows-6">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <div
                                                className="flex h-full w-full select-none flex-col flex-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                                                <Flower strokeWidth={1} size={100}/>
                                                <p className="mt-10 text-sm leading-tight text-muted-foreground">
                                                    Discover the latest trends in women's fashion, from casual to chic.
                                                </p>
                                            </div>
                                        </NavigationMenuLink>
                                    </li>
                                    {womenCategories.map((component) => (
                                        <ListItem
                                            key={component.title}
                                            title={component.title}
                                            href={component.href}
                                        >
                                            {component.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className='text-xl'>Kids</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 md:w-[600px] lg:grid-flow-col lg:auto-cols-fr lg:grid-rows-6">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <div
                                                className="flex h-full w-full select-none flex-col flex-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                                                <Baby strokeWidth={1} size={100}/>
                                                <p className="mt-10 text-sm leading-tight text-muted-foreground">
                                                    Fun and comfortable clothing for kids of all ages.
                                                </p>
                                            </div>
                                        </NavigationMenuLink>
                                    </li>
                                    {kidsCategories.map((component) => (
                                        <ListItem
                                            key={component.title}
                                            title={component.title}
                                            href={component.href}
                                        >
                                            {component.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className='text-xl'>Price</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className='p-10 flex flex-col items-center'>
                                <Calculator />
                                <h2 className='mt-2 text-xl font-bold'>Price from-to</h2>
                                <div className='mt-5 flex flex-row gap-5'>
                                    <Input type='number' min={0} placeholder='From' value={priceFrom}
                                           onChange={handlePriceFromInputChange}/>
                                    <Input type='number' max={1000} placeholder='To' value={priceTo}
                                           onChange={handlePriceToInputChange}/>
                                </div>
                                <PriceSlider
                                    className='mt-5'
                                    initialValues={[priceFrom || 0, priceTo || 1000]}
                                    max={1000}
                                    min={0}
                                    inputPriceFromChange={handlePriceFromInputChange}
                                    inputPriceToChange={handlePriceToInputChange}
                                />
                                <PriceChart className='mt-5'/>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger className='text-xl'>Sizes</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className='p-10 flex flex-col flex-between  w-[300px]'>
                                <PencilRuler />
                                <h2 className='mt-2 text-xl font-bold'>Choose desired sizes</h2>
                                <div className="mt-5 grid grid-cols-2 gap-x-8">
                                    <div className="flex flex-col gap-4 justify-self-start">
                                        <FilterCheckbox text="S" name="S"/>
                                        <FilterCheckbox text="M" name="M"/>
                                        <FilterCheckbox text="L" name="L"/>
                                    </div>
                                    <div className="flex flex-col gap-4 justify-self-end">
                                        <FilterCheckbox text="XL" name="XL"/>
                                        <FilterCheckbox text="2XL" name="2XL"/>
                                        <FilterCheckbox text="3XL" name="3XL"/>
                                    </div>
                                </div>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger className='text-xl'>Categories</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className='p-10 flex flex-col flex-between  w-[500px]'>
                                <Logs />
                                <h2 className='mt-2 text-xl font-bold'>Choose your categories</h2>
                                <Tabs defaultValue="Men" className="w-[400px] mt-5">
                                    <TabsList className='grid w-full grid-cols-3'>
                                        <TabsTrigger value="Men">Men</TabsTrigger>
                                        <TabsTrigger value="Women">Women</TabsTrigger>
                                        <TabsTrigger value="Kids">Kids</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="Men" className='mt-5'>
                                        <div className="py-2 grid w-full grid-cols-3 gap-x-30 gap-y-6">
                                            <FilterCheckbox text="Hoodies" name="S"/>
                                            <FilterCheckbox text="T-Shirts" name="L"/>
                                            <FilterCheckbox text="Scarfs" name="3XL"/>
                                            <FilterCheckbox text="Gloves" name="3XL"/>
                                            <FilterCheckbox text="Gloves" name="3XL"/>
                                            <FilterCheckbox text="Long-sleeves" name="M"/>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="Women" className='mt-5'>
                                        <div className="py-2 grid w-full grid-cols-3 gap-x-30 gap-y-6">
                                            <FilterCheckbox text="Shorts" name="XL"/>
                                            <FilterCheckbox text="Jeans" name="2XL"/>
                                            <FilterCheckbox text="Trousers" name="3XL"/>
                                            <FilterCheckbox text="Socks" name="3XL"/>
                                            <FilterCheckbox text="Bags" name="3XL"/>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="Kids" className='mt-5'>
                                        <div className="py-2 grid w-full grid-cols-3 gap-x-30 gap-y-6">
                                            <FilterCheckbox text="Dresses" name="XL"/>
                                            <FilterCheckbox text="Jackets" name="2XL"/>
                                            <FilterCheckbox text="Skirts" name="3XL"/>
                                            <FilterCheckbox text="Sweatshirts" name="3XL"/>
                                            <FilterCheckbox text="Shoes" name="3XL"/>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <Badge variant='outline' className='p-0 m-0'>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className='text-xl'>
                                Stone limited collection
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>

                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </Badge>
                </NavigationMenuList>
            </NavigationMenu>

        </div>
    );

}

const ListItem = forwardRef(({className, title, children, ...props}, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})