// types/next-auth.d.ts
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: 'ADMIN' | 'USER';
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        role: 'ADMIN' | 'USER';
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: 'ADMIN' | 'USER';
    }
}