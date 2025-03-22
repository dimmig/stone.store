import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { getOrderStatusEmailTemplate } from '@/lib/email-templates';

// Get single order
export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id: params.orderId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to view this order
    if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// Update order status
export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user to check if admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updateData: Record<string, any> = {};

    // Handle status update
    if (body.status) {
      const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }
      updateData.status = body.status;
    }

    // Handle note update
    if (body.note !== undefined) {
      updateData.note = body.note;
    }

    // Handle tracking number update
    if (body.trackingNumber !== undefined) {
      updateData.trackingNumber = body.trackingNumber;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.orderId },
      data: updateData,
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
    });

    // If status was updated, send email notification
    if (body.status) {
      // Create notification in database
      await prisma.notification.create({
        data: {
          userId: updatedOrder.user.id,
          type: 'ORDER_STATUS_UPDATED',
          message: `Your order #${updatedOrder.id} status has been updated to ${body.status}.`
        }
      });

      // Send email notification
      await sendEmail({
        to: updatedOrder.user.email!,
        subject: `Order #${updatedOrder.id} Status Update`,
        html: getOrderStatusEmailTemplate({
          orderId: updatedOrder.id,
          status: body.status,
          trackingNumber: updatedOrder.trackingNumber || undefined,
          appUrl: process.env.NEXT_PUBLIC_APP_URL!,
          items: updatedOrder.items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price
          })),
          total: updatedOrder.total,
          shippingAddress: {
            name: updatedOrder.shippingAddress.name,
            street: updatedOrder.shippingAddress.street,
            city: updatedOrder.shippingAddress.city,
            state: updatedOrder.shippingAddress.state,
            zip: updatedOrder.shippingAddress.zip
          }
        })
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// Delete order (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can delete orders
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete order items first
    await prisma.orderItem.deleteMany({
      where: {
        orderId: params.orderId,
      },
    });

    // Then delete the order
    const order = await prisma.order.delete({
      where: {
        id: params.orderId,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
} 