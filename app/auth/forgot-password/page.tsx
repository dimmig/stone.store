'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {motion} from 'framer-motion';
import {Loader2, Mail, CheckCircle2} from 'lucide-react';
import { Logo } from "../../components/ui/logo";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email}),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50">
            <div className="container mx-auto flex min-h-full flex-1 items-center justify-center px-4 py-12">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    className="w-full max-w-md"
                >
                    <div className="mx-auto w-full max-w-md space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight">Reset your password</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Remember your password?{' '}
                                <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        <div className="mt-8">
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                {error && (
                                    <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-500">
                                        {error}
                                    </div>
                                )}

                                {success ? (
                                    <motion.div
                                        initial={{opacity: 0, scale: 0.95}}
                                        animate={{opacity: 1, scale: 1}}
                                        transition={{duration: 0.3}}
                                        className="text-center"
                                    >
                                        <motion.div
                                            initial={{scale: 0}}
                                            animate={{scale: 1}}
                                            transition={{delay: 0.2, type: "spring", stiffness: 200}}
                                            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
                                        >
                                            <CheckCircle2 className="h-6 w-6 text-green-600"/>
                                        </motion.div>
                                        <h3 className="mb-2 text-lg font-semibold text-gray-900">Check your email</h3>
                                        <p className="mb-6 text-sm text-gray-600">
                                            We've sent a password reset link to <span
                                            className="font-medium text-gray-900">{email}</span>
                                        </p>
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-500">
                                                Didn't receive the email? Check your spam folder or try again.
                                            </p>
                                            <button
                                                onClick={() => setSuccess(false)}
                                                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                                            >
                                                Try another email
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email address
                                            </label>
                                            <div className="relative mt-1">
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 pl-10 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                                    placeholder="Enter your email"
                                                />
                                                <Mail
                                                    className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400"/>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                    Sending reset link...
                                                </>
                                            ) : (
                                                'Send reset link'
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 