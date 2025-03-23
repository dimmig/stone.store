import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ProductWithColors {
    colors: string[];
}

interface ProductWithSizes {
    sizes: string[];
}

interface ProductWithPrice {
    price: number;
}

interface ProductWithRating {
    rating: number;
}

export async function GET() {
    try {
        // Get unique categories
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        // Get unique colors
        const productsWithColors = await prisma.product.findMany({
            select: {
                colors: true,
            },
        });

        // Get unique sizes
        const productsWithSizes = await prisma.product.findMany({
            select: {
                sizes: true,
            },
        });

        // Get price range
        const productsWithPrice = await prisma.product.findMany({
            select: {
                price: true,
            },
        });

        // Get ratings
        const productsWithRating = await prisma.product.findMany({
            select: {
                rating: true,
            },
        });

        // Process colors
        const uniqueColors = Array.from(
            new Set(
                productsWithColors
                    .flatMap((p) => p.colors)
                    .filter((color): color is string => color !== null)
            )
        ).sort();

        // Process sizes
        const uniqueSizes = Array.from(
            new Set(
                productsWithSizes
                    .flatMap((p) => p.sizes)
                    .filter((size): size is string => size !== null)
            )
        ).sort();

        // Process price ranges
        const prices = productsWithPrice.map((p) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Process ratings
        const ratings = productsWithRating
            .map((p) => p.rating)
            .filter((rating): rating is number => rating !== null);
        
        const uniqueRatings = Array.from(new Set(ratings)).sort((a, b) => b - a);
        
        const ratingOptions = uniqueRatings.map(rating => ({
            label: `${rating} & up`,
            value: rating.toString(),
            count: ratings.filter(r => r >= rating).length
        }));

        // Generate price ranges based on actual data
        const priceRanges = generatePriceRanges(minPrice, maxPrice);

        return NextResponse.json({
            categories: categories.map(cat => ({
                label: cat.name,
                value: cat.id,
            })),
            colors: uniqueColors.map(color => ({
                label: color,
                value: color,
                class: getColorClass(color),
            })),
            sizes: uniqueSizes,
            priceRanges,
            ratingOptions,
        });
    } catch (error) {
        console.error('Error fetching filter options:', error);
        return NextResponse.json(
            { error: 'Failed to fetch filter options' },
            { status: 500 }
        );
    }
}

function getColorClass(color: string): string {
    const colorMap: { [key: string]: string } = {
        black: 'bg-black',
        white: 'bg-white border border-gray-200',
        red: 'bg-red-500',
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500',
        pink: 'bg-pink-500',
        gray: 'bg-gray-500',
        brown: 'bg-amber-800',
        orange: 'bg-orange-500',
        navy: 'bg-blue-900',
        beige: 'bg-amber-100',
        gold: 'bg-yellow-600',
        silver: 'bg-gray-300',
    };
    return colorMap[color.toLowerCase()] || 'bg-gray-200';
}

function generatePriceRanges(minPrice: number, maxPrice: number) {
    const ranges = [
        { label: 'All Prices', value: '' },
        { label: `Under $${Math.ceil(minPrice)}`, value: `0-${Math.ceil(minPrice)}` },
    ];

    const step = Math.ceil((maxPrice - minPrice) / 4);
    let currentMin = Math.ceil(minPrice);

    for (let i = 0; i < 3; i++) {
        const currentMax = currentMin + step;
        ranges.push({
            label: `$${currentMin} - $${currentMax}`,
            value: `${currentMin}-${currentMax}`,
        });
        currentMin = currentMax + 1;
    }

    ranges.push({
        label: `Over $${currentMin}`,
        value: `${currentMin}-`,
    });

    return ranges;
} 