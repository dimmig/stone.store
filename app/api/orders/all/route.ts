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
    size?: string;
    color?: string;
    product: {
        id: string;
        name: string;
        price: number;
        imageUrls: string[];
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
        console.log(session?.user);

        if (!session?.user || session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                imageUrls: true,
                                description: true,
                            }
                        }
                    }
                },
                shippingAddress: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        return new NextResponse('Internal error', { status: 500 });
    }
} 