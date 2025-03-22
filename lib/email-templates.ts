interface PasswordResetEmailProps {
  resetUrl: string;
  appUrl: string;
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