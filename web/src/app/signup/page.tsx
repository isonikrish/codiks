"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/stores/useApp';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Signup = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, user } = useApp();
    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await signup({ name, email, password }, router);
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Welcome Back 👋</CardTitle>
                    <CardDescription className="text-center text-sm text-gray-400 mt-2">
                        Please login to continue
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <Label htmlFor="name" className="text-sm mb-2">
                                Name
                            </Label>
                            <Input
                                type="text"
                                id="name"
                                placeholder="your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email" className="text-sm mb-2">
                                Email
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-sm mb-2">
                                Password
                            </Label>
                            <Input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full font-medium"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                </>
                            ) : (
                                'Signup'
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link href={"/login"} className='underline text-blue-500'>Login</Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Signup;
