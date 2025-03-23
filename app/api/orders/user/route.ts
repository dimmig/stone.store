import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type OrderWithRelations = Prisma.OrderGetPayload<{
    include: {
        user: {
            select: {
                name: true;
                email: true;
            }
        };
        items: {
            include: {
                product: {
                    select: {
                        id: true;
                        name: true;
                        price: true;
                        imageUrls: true;
                        description: true;
                    }
                }
            }
        };
        shippingAddress: true;
    }
}>;

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: {
                user: {
                    email: session.user.email
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                items: {
                    select: {
                        id: true,
                        productId: true,
                        quantity: true,
                        price: true,
                        size: true,
                        color: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                imageUrls: true,
                                description: true
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

        // Calculate total for each order based on items
        const ordersWithTotal = orders.map((order: OrderWithRelations) => ({
            ...order,
            total: order.items.reduce((sum: number, item) => sum + (item.price * item.quantity), 0)
        }));

        return NextResponse.json(ordersWithTotal);
    } catch (error) {
        console.error('[ORDERS_USER_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
} 