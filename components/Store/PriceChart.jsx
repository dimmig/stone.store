"use client"
import * as React from "react"
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {cn} from "@/lib/utils";


const chartData = [
    {price: 100, offers: 50},
    {price: 150, offers: 75},
    {price: 200, offers: 60},
    {price: 250, offers: 90},
    {price: 300, offers: 180},
    {price: 350, offers: 80},
    {price: 400, offers: 130},
    {price: 450, offers: 70},
    {price: 500, offers: 123},
    {price: 550, offers: 140},
    {price: 600, offers: 96},
    {price: 650, offers: 160},
    {price: 700, offers: 170},
    {price: 750, offers: 130},
    {price: 800, offers: 180},
    {price: 850, offers: 90},
    {price: 900, offers: 210},
    {price: 950, offers: 100},
    {price: 1000, offers: 220},
    {price: 1050, offers: 120},
    {price: 1100, offers: 230},
    {price: 1150, offers: 160},
    {price: 1200, offers: 120},
    {price: 1250, offers: 180},
    {price: 1300, offers: 250},
    {price: 1350, offers: 140},
    {price: 1400, offers: 260},
    {price: 1450, offers: 150},
    {price: 1500, offers: 270},
    {price: 1550, offers: 160},
    {price: 1600, offers: 280},
    {price: 1650, offers: 170},
    {price: 1700, offers: 100},
    {price: 1750, offers: 180},
    {price: 1800, offers: 300},
    {price: 1850, offers: 190},
    {price: 1900, offers: 310},
    {price: 1950, offers: 87},
    {price: 2000, offers: 128},
]

const chartConfig = {
    offers: {
        label: "Offers",
        color: "hsl(var(--chart-1))",
    },
    price: {
        label: "Price",
        color: "hsl(var(--chart-1))",
    }
}

export function PriceChart({className}) {
    const totalOffers = React.useMemo(
        () => chartData.reduce((acc, curr) => acc + curr.offers, 0),
        []
    );

    const xAxisProps = {
        dataKey: "price",
        tickLine: false,
        axisLine: false,
        tickMargin: 8,
        minTickGap: 16,
        tickFormatter: (value) => `$${value}`,
    }

    const yAxisProps = {
        tickLine: false,
        axisLine: false,
        tickMargin: 8
    }

    return (
        <Card className={cn("w-[400px] h-[400px]", className)}>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Price vs Offers</CardTitle>
                    <CardDescription>
                        Total offers at different price points
                    </CardDescription>
                </div>
                <div className="flex">
                    <button
                        className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    >
            <span className="text-xs text-muted-foreground">
              {chartConfig.offers.label}
            </span>
                        <span className="text-lg font-bold leading-none sm:text-3xl">
              {totalOffers.toLocaleString()}
            </span>
                    </button>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false}/>
                        <XAxis {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="offers"
                                    labelFormatter={(value) => `${value}`}
                                />
                            }
                        />
                        <Bar dataKey="offers" fill={chartConfig.offers.color}/>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}