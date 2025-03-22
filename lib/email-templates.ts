interface PasswordResetEmailProps {
  resetUrl: string;
  appUrl: string;
}

interface OrderNotificationEmailProps {
  orderId: string;
  status: string;
  trackingNumber?: string;
  appUrl: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export function getPasswordResetEmailTemplate({ resetUrl, appUrl }: PasswordResetEmailProps): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #ffffff;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 24px;
            text-decoration: none;
            color: #000;
          }
          .logo-text {
            font-size: 24px;
            font-weight: bold;
            color: #000;
            text-decoration: none;
          }
          .content {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #000;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 500;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          .divider {
            height: 1px;
            background-color: #eaeaea;
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="${appUrl}" class="logo-container">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style="color: #000;"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zM8 13.5a1.5 1.5 0 013 0v5a1.5 1.5 0 01-3 0v-5zm6.5-1.5a1.5 1.5 0 00-1.5 1.5v5a1.5 1.5 0 003 0v-2h2a1.5 1.5 0 000-3h-2v-1.5zm9 1.5a1.5 1.5 0 00-3 0v5a1.5 1.5 0 003 0v-5z"
                  fill="currentColor"
                />
              </svg>
              <span class="logo-text">STONE.STORE</span>
            </a>
          </div>
          <div class="content">
            <h1 style="margin: 0 0 20px; font-size: 24px; font-weight: 600;">Reset Your Password</h1>
            <p style="margin: 0 0 16px;">Hello,</p>
            <p style="margin: 0 0 16px;">We received a request to reset your password. Click the button below to choose a new password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p style="margin: 16px 0 0; font-size: 14px;">If you didn't request this password reset, you can safely ignore this email.</p>
            <div class="divider"></div>
            <p style="margin: 0; font-size: 14px; color: #666;">This link will expire in 1 hour for security reasons.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} STONE.STORE. All rights reserved.</p>
            <p style="margin: 5px 0 0;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="margin: 5px 0 0; font-size: 12px; color: #999; word-break: break-all;">${resetUrl}</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function getOrderStatusEmailTemplate({ orderId, status, trackingNumber, appUrl, items, total, shippingAddress }: OrderNotificationEmailProps): string {
  const statusConfig = {
    processing: {
      title: 'Your Order is Being Processed',
      message: 'We\'re preparing your order for shipping. You\'ll receive another update when it ships.',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.5V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16V15.5" stroke="#FFB800" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 14L12 10" stroke="#FFB800" stroke-width="2" stroke-linecap="round"/>
              <path d="M16 14L16 10" stroke="#FFB800" stroke-width="2" stroke-linecap="round"/>
              <path d="M8 14L8 10" stroke="#FFB800" stroke-width="2" stroke-linecap="round"/>
            </svg>`
    },
    shipped: {
      title: 'Your Order Has Shipped!',
      message: trackingNumber 
        ? `Your order is on the way! Track your shipment with tracking number: ${trackingNumber}`
        : 'Your order is on the way!',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8H21L19 11H16V8Z" stroke="#2563EB" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 9H12" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/>
              <path d="M2 12H10" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/>
              <path d="M2 15H8" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/>
              <path d="M16 8V16H19C20.1046 16 21 15.1046 21 14V11" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="16" cy="16" r="2" stroke="#2563EB" stroke-width="2"/>
              <path d="M5 8H12V16H3C2.44772 16 2 15.5523 2 15V9C2 8.44772 2.44772 8 3 8H5Z" stroke="#2563EB" stroke-width="2"/>
            </svg>`
    },
    delivered: {
      title: 'Your Order Has Been Delivered',
      message: 'Your order has been successfully delivered to your address.',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#22C55E" stroke-width="2"/>
              <path d="M7.5 12L10.5 15L16.5 9" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
    },
    cancelled: {
      title: 'Order Cancelled',
      message: 'Your order has been cancelled. If you have any questions, please contact our support team.',
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#EF4444" stroke-width="2"/>
              <path d="M15 9L9 15" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 9L15 15" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
            </svg>`
    }
  };

  const statusInfo = statusConfig[status as keyof typeof statusConfig];

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${statusInfo.title}</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #ffffff;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 24px;
            text-decoration: none;
            color: #000;
          }
          .logo-text {
            font-size: 24px;
            font-weight: bold;
            color: #000;
            text-decoration: none;
          }
          .content {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .status-icon {
            text-align: center;
            margin-bottom: 24px;
            line-height: 1;
          }
          .status-icon svg {
            width: 64px;
            height: 64px;
          }
          .order-details {
            background-color: #f8f8f8;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .order-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
          }
          .order-item:last-child {
            border-bottom: none;
          }
          .total {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            font-weight: bold;
            text-align: right;
          }
          .shipping-address {
            margin-top: 20px;
            padding: 20px;
            background-color: #f8f8f8;
            border-radius: 8px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #000;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 500;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          .divider {
            height: 1px;
            background-color: #eaeaea;
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="${appUrl}" class="logo-container">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style="color: #000;"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zM8 13.5a1.5 1.5 0 013 0v5a1.5 1.5 0 01-3 0v-5zm6.5-1.5a1.5 1.5 0 00-1.5 1.5v5a1.5 1.5 0 003 0v-2h2a1.5 1.5 0 000-3h-2v-1.5zm9 1.5a1.5 1.5 0 00-3 0v5a1.5 1.5 0 003 0v-5z"
                  fill="currentColor"
                />
              </svg>
              <span class="logo-text">STONE.STORE</span>
            </a>
          </div>
          <div class="content">
            <div class="status-icon">${statusInfo.icon}</div>
            <h1 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; text-align: center;">${statusInfo.title}</h1>
            <p style="margin: 0 0 16px; text-align: center;">${statusInfo.message}</p>
            
            <div class="order-details">
              <h2 style="margin: 0 0 16px; font-size: 18px;">Order Details</h2>
              <p style="margin: 0 0 16px;">Order ID: #${orderId}</p>
              
              <div class="order-items">
                ${items.map(item => `
                  <div class="order-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                `).join('')}
              </div>
              
              <div class="total">
                Total: $${total.toFixed(2)}
              </div>
            </div>

            <div class="shipping-address">
              <h3 style="margin: 0 0 12px; font-size: 16px;">Shipping Address</h3>
              <p style="margin: 0;">${shippingAddress.name}</p>
              <p style="margin: 4px 0;">${shippingAddress.street}</p>
              <p style="margin: 0;">${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}</p>
            </div>

            <div style="text-align: center;">
              <a href="${appUrl}/dashboard/orders" class="button">View Order Details</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} STONE.STORE. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
} 