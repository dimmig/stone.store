import {NextResponse} from 'next/server';
import {getServerSession, Session} from 'next-auth';
import {authOptions} from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import type {Prisma, User} from '@prisma/client';

interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        price: number;
        images: string[];
        description: string | null;
    };
}

interface OrderWithItems {
    id: string;
    userId: string;
    status: string;
    createdAt: Date;
    items: OrderItem[];
    user?: {
        id: string;
        name: string | null;
        email: string | null;
    };
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
}

export async function GET() {
    try {
        const session: Session | null = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                {error: 'Unauthorized'},
                {status: 401}
            );
        }

        // Fetch user with role from database
        const user = await prisma.user.findUnique({
            where: {email: session.user.email},
            select: {
                id: true,
                role: true
            }
        }) as User;

        if (!user) {
            return NextResponse.json(
                {error: 'User not fou   nd'},
                {status: 404}
            );
        }
        console.log(user)
        const isAdmin = user.role === 'ADMIN';

        const orders = await prisma.order.findMany({
            where: isAdmin ? {} : {
                userId: user.id, // Use the fetched user's ID instead of session.user.id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                images: true,
                                description: true,
                            }
                        },
                    },
                },
                shippingAddress: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const ordersWithTotal = orders.map((order: OrderWithItems) => ({
            ...order,
            total: order.items.reduce((sum: number, item: OrderItem) =>
                sum + (Number(item.price) * Number(item.quantity)), 0
            )
        }));

        return NextResponse.json(ordersWithTotal);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        return NextResponse.json(
            {error: 'Failed to fetch orders'},
            {status: 500}
        );
    }
} 