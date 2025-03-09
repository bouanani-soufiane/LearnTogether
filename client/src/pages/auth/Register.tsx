import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { UserRequestDTO, UserRole } from '../../types';
import { apiInstance } from '../../api';
import { API } from '../../api/endpoints';
import { routePaths } from '../../constants/routes';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AtSign, User, Lock, Loader2, ArrowRight, GraduationCap } from 'lucide-react';

const registerSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
    role: z.nativeEnum(UserRole)
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: UserRole.TEACHER,
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const { confirmPassword, ...requestData } = data;

            const response = await apiInstance.post<UserRequestDTO>(API.register, requestData);

            console.log('Registration successful:', response.data);

            navigate(routePaths.LOGIN);
        } catch (error: any) {
            console.error('Registration error:', error);

            if (error.response) {
                if (error.response.data?.message) {
                    setError(error.response.data.message);
                } else {
                    setError('Registration failed. Please try again.');
                }
            } else if (error.request) {
                setError('No response from server. Please check your connection and try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-orange-50 p-4">
            <div className="w-full max-w-md">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-sky-400/20 to-orange-400/20 blur-3xl -z-10 transform -translate-y-1/2"></div>

                <div className="relative">
                    {/* Logo/Brand */}
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sky-500 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-200/50">
                            <span className="text-white text-2xl font-bold">LT</span>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-orange-200/30 hover:shadow-2xl">
                        {/* Header */}
                        <div className="p-6 text-center">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-orange-500 bg-clip-text text-transparent">Join LearnTogether</h2>
                            <p className="text-gray-600 mt-2">
                                Create an account to start your learning journey
                            </p>
                        </div>

                        <div className="px-6 pb-6">
                            {error && (
                                <Alert variant="destructive" className="mb-6 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-xl animate-fade-in">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Full Name</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                            <User size={18} />
                                                        </div>
                                                        <Input
                                                            placeholder="John Doe"
                                                            className={`pl-10 pr-4 py-3 border ${form.formState.errors.fullName ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white/60'} rounded-xl shadow-sm focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200`}
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-600 text-sm" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Email</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                            <AtSign size={18} />
                                                        </div>
                                                        <Input
                                                            type="email"
                                                            placeholder="you@example.com"
                                                            className={`pl-10 pr-4 py-3 border ${form.formState.errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white/60'} rounded-xl shadow-sm focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200`}
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-600 text-sm" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                            <Lock size={18} />
                                                        </div>
                                                        <Input
                                                            type="password"
                                                            placeholder="••••••••"
                                                            className={`pl-10 pr-4 py-3 border ${form.formState.errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white/60'} rounded-xl shadow-sm focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200`}
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormDescription className="text-xs text-gray-500">
                                                    Password must be at least 8 characters
                                                </FormDescription>
                                                <FormMessage className="text-red-600 text-sm" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                            <Lock size={18} />
                                                        </div>
                                                        <Input
                                                            type="password"
                                                            placeholder="••••••••"
                                                            className={`pl-10 pr-4 py-3 border ${form.formState.errors.confirmPassword ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white/60'} rounded-xl shadow-sm focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200`}
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-600 text-sm" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Account Type</FormLabel>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                                                        <GraduationCap size={18} />
                                                    </div>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="pl-10 pr-4 py-3 border border-gray-200 bg-white/60 rounded-xl shadow-sm focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200">
                                                                <SelectValue placeholder="Select account type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg">
                                                            <SelectItem value={UserRole.STUDENT} className="focus:bg-sky-50">Student</SelectItem>
                                                            <SelectItem value={UserRole.TEACHER} className="focus:bg-sky-50">Teacher</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <FormMessage className="text-red-600 text-sm" />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full py-3 px-4 mt-4 flex items-center justify-center rounded-xl text-white bg-gradient-to-r from-sky-500 to-orange-500 hover:from-sky-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-orange-200/50 font-medium"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Creating account...
                                            </>
                                        ) : (
                                            <span className="flex items-center">
                                                Create account
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-sky-50 to-orange-50/50 flex justify-center">
                            <div className="text-center">
                                <span className="text-gray-600">Already have an account?</span>{' '}
                                <Button
                                    variant="link"
                                    className="p-0 text-sky-600 hover:text-orange-500 font-medium transition-colors duration-200"
                                    onClick={() => navigate(routePaths.LOGIN)}
                                >
                                    Sign in
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Footer text */}
                    <p className="text-center text-gray-500 text-xs mt-6">
                        © 2025 LearnTogether. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
