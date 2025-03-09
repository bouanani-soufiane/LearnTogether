"use client"

import type React from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { routePaths } from "../../constants/routes"
import { AtSign, Lock, Loader2, ArrowRight } from "lucide-react"

const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

const Login: React.FC = () => {
    const navigate = useNavigate()
    const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    useEffect(() => {
        clearError()
    }, [clearError])

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/")
        }
    }, [isAuthenticated, navigate])

    const onSubmit = async (data: LoginFormValues) => {
        await login(data.email, data.password)
    }

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
                        <div className="p-8 text-center">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-orange-500 bg-clip-text text-transparent">
                                Welcome back
                            </h2>
                            <p className="text-gray-600 mt-2">Sign in to continue your learning journey</p>
                        </div>

                        <div className="px-8 pb-8">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-xl text-sm animate-fade-in">
                                    <p className="font-medium">Authentication Error</p>
                                    <p>{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-1">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <AtSign size={18} />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            className={`w-full pl-10 pr-4 py-3 border ${errors.email ? "border-red-300 bg-red-50/50" : "border-gray-200 bg-white/60"} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200`}
                                            {...register("email")}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            className="text-sm font-medium text-sky-600 hover:text-orange-500 transition-colors duration-200"
                                            onClick={() => {
                                                /* Implement forgot password functionality */
                                            }}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            id="password"
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            className={`w-full pl-10 pr-4 py-3 border ${errors.password ? "border-red-300 bg-red-50/50" : "border-gray-200 bg-white/60"} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200`}
                                            {...register("password")}
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">{errors.password.message}</p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <div className="relative flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="remember-me"
                                                name="remember-me"
                                                type="checkbox"
                                                className="h-4 w-4 text-sky-500 focus:ring-orange-400 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-2 text-sm">
                                            <label htmlFor="remember-me" className="font-medium text-gray-700">
                                                Remember me
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 flex items-center justify-center rounded-xl text-white bg-gradient-to-r from-sky-500 to-orange-500 hover:from-sky-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-orange-200/50 font-medium"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Signing in...
                    </span>
                                    ) : (
                                        <span className="flex items-center">
                      Sign in
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-sky-50 to-orange-50/50 flex justify-center">
                            <div className="text-center">
                                <span className="text-gray-600">Don't have an account?</span>{" "}
                                <button
                                    className="text-sky-600 hover:text-orange-500 font-medium transition-colors duration-200 ml-1"
                                    onClick={() => navigate(routePaths.REGISTER)}
                                >
                                    Create an account
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer text */}
                    <p className="text-center text-gray-500 text-xs mt-6">© 2025 LearnTogether. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default Login

