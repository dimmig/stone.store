"use client"
import React, { useState, useEffect } from "react"
import * as Slider from '@radix-ui/react-slider';
import { cn } from "@/lib/utils";

export const PriceSlider = ({ className, initialValues, max , min, inputPriceFromChange, inputPriceToChange }) => {
    const [values, setValues] = useState(Array.isArray(initialValues) ? initialValues : [min, max]);

    useEffect(() => {
        setValues(Array.isArray(initialValues) ? initialValues : [min, max]);
    }, [initialValues, min, max]);

    const handleSliderChange = (prices) => {
        setValues(prices);
        inputPriceFromChange(prices[0])
        inputPriceToChange(prices[1])
    };

    return (
        <Slider.Root
            className={cn('relative flex w-full touch-none select-none mb-6 items-center', className)}
            value={values}
            step={1}
            min={min}
            max={max}
            onValueChange={handleSliderChange}
        >
            <Slider.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-primary/20">
                <Slider.Range className="absolute h-full bg-primary" />
            </Slider.Track>
            {values.map((value, index) => (
                <React.Fragment key={index}>
                    <div
                        className="absolute text-center"
                        style={{
                            left: `calc(${((value - min) / (max - min)) * 100}% + 0px)`,
                            top: `10px`,
                        }}>
                        <span className="text-sm">{value}</span>
                    </div>
                    <Slider.Thumb
                        className="block h-4 w-4 rounded-full border border-primary/50 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        aria-label="Price"
                    />
                </React.Fragment>
            ))}
        </Slider.Root>
    );
}
