"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Trophy,
    Calendar,
    Award,
    Star,
    Zap,
    Filter,
    Medal,
    ArrowUp,
    Gift,
    Check,
    ChevronRight,
    Badge,
    BarChart3
} from "lucide-react";

interface User {
    id: number;
    fullName: string;
    reputation: number;
    avatar?: string;
    badges: {
        gold: number;
        silver: number;
        bronze: number;
    };
    questionsCount: number;
    answersCount: number;
    acceptRate: number;
    streak: number;
    tags: string[];
    rank?: number;
    change?: number;
}

type TimeRange = "week" | "month" | "year" | "all";

const generateMockUsers = (count: number): User[] => {
    const users: User[] = [];

    for (let i = 1; i <= count; i++) {
        const reputation = Math.floor(Math.random() * 50000) + 1000;
        const change = Math.floor(Math.random() * 1000) - 200;

        users.push({
            id: i,
            fullName: `User ${i}`,
            reputation,
            badges: {
                gold: Math.floor(Math.random() * 50),
                silver: Math.floor(Math.random() * 100),
                bronze: Math.floor(Math.random() * 200),
            },
            questionsCount: Math.floor(Math.random() * 100),
            answersCount: Math.floor(Math.random() * 500),
            acceptRate: Math.floor(Math.random() * 100),
            streak: Math.floor(Math.random() * 365),
            tags: ["javascript", "react", "node.js", "typescript"].slice(0, Math.floor(Math.random() * 4) + 1),
            rank: i,
            change
        });
    }

    return users.sort((a, b) => b.reputation - a.reputation);
};

const LeaderboardPage: React.FC = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>("week");
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<string>("reputation");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setUsers(generateMockUsers(50));
            setIsLoading(false);
        }, 800);
    }, [timeRange, filter]);

    const getFormattedTimeRange = () => {
        switch (timeRange) {
            case "week": return "This Week";
            case "month": return "This Month";
            case "year": return "This Year";
            case "all": return "All Time";
        }
    };

    const getAvatarBackground = (rank: number) => {
        if (rank === 1) return "from-amber-400 to-amber-600";
        if (rank === 2) return "from-slate-300 to-slate-500";
        if (rank === 3) return "from-amber-700 to-amber-900";
        return "from-sky-500 to-orange-400";
    };

    const getRankChange = (change: number | undefined) => {
        if (change === undefined) return null;

        if (change > 0) {
            return <span className="text-emerald-600 text-xs flex items-center"><ArrowUp size={12} className="mr-0.5" />+{change}</span>;
        } else if (change < 0) {
            return <span className="text-rose-600 text-xs flex items-center"><ArrowUp size={12} className="mr-0.5 rotate-180" />{change}</span>;
        }

        return <span className="text-gray-500 text-xs">-</span>;
    };

    const getFilterLabel = (filterType: string) => {
        switch (filterType) {
            case "reputation": return "Reputation";
            case "answers": return "Answers";
            case "questions": return "Questions";
            case "badges": return "Badges";
            case "streak": return "Streak";
            default: return "Reputation";
        }
    };

    const renderBadges = (badges: { gold: number; silver: number; bronze: number }) => {
        return (
            <div className="flex space-x-2">
                {badges.gold > 0 && (
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-400 mr-1"></div>
                        <span className="text-xs">{badges.gold}</span>
                    </div>
                )}
                {badges.silver > 0 && (
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-slate-300 mr-1"></div>
                        <span className="text-xs">{badges.silver}</span>
                    </div>
                )}
                {badges.bronze > 0 && (
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-800 mr-1"></div>
                        <span className="text-xs">{badges.bronze}</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex">

            <div className="flex-1 ml-0  pt-16">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                                <Trophy size={28} className="mr-3 text-amber-500" />
                                <span className="bg-gradient-to-r from-sky-600 to-orange-500 bg-clip-text text-transparent">
                  Leaderboard
                </span>
                            </h1>
                            <p className="text-gray-600">
                                Top contributors building our knowledge community
                            </p>
                        </div>

                        <div className="mt-4 md:mt-0 flex items-center space-x-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-2 bg-white rounded-xl border border-sky-100 shadow-sm hover:shadow-md transition-all flex items-center space-x-2 text-gray-700 hover:text-sky-600"
                            >
                                <Filter size={16} />
                                <span>Filters</span>
                            </button>

                            <div className="relative group">
                                <button className="px-4 py-2 bg-white rounded-xl border border-sky-100 shadow-sm hover:shadow-md transition-all flex items-center space-x-2 text-gray-700 hover:text-sky-600">
                                    <Calendar size={16} />
                                    <span>{getFormattedTimeRange()}</span>
                                </button>

                                <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-sky-100/50 hidden group-hover:block z-10">
                                    <button
                                        onClick={() => setTimeRange("week")}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-sky-50 transition-colors ${timeRange === "week" ? "text-sky-600 font-medium" : "text-gray-700"}`}
                                    >
                                        This Week
                                    </button>
                                    <button
                                        onClick={() => setTimeRange("month")}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-sky-50 transition-colors ${timeRange === "month" ? "text-sky-600 font-medium" : "text-gray-700"}`}
                                    >
                                        This Month
                                    </button>
                                    <button
                                        onClick={() => setTimeRange("year")}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-sky-50 transition-colors ${timeRange === "year" ? "text-sky-600 font-medium" : "text-gray-700"}`}
                                    >
                                        This Year
                                    </button>
                                    <button
                                        onClick={() => setTimeRange("all")}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-sky-50 transition-colors ${timeRange === "all" ? "text-sky-600 font-medium" : "text-gray-700"}`}
                                    >
                                        All Time
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl border border-sky-100/50 shadow-sm p-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter By:</h3>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilter("reputation")}
                                    className={`px-3 py-1.5 rounded-lg text-sm ${filter === "reputation" ? "bg-gradient-to-r from-sky-500/20 to-orange-500/20 text-sky-700 font-medium border border-sky-200/50" : "bg-white border border-sky-100 text-gray-700 hover:bg-sky-50"}`}
                                >
                                    <Star size={14} className="inline mr-1 text-amber-500" />
                                    Reputation
                                </button>
                                <button
                                    onClick={() => setFilter("answers")}
                                    className={`px-3 py-1.5 rounded-lg text-sm ${filter === "answers" ? "bg-gradient-to-r from-sky-500/20 to-orange-500/20 text-sky-700 font-medium border border-sky-200/50" : "bg-white border border-sky-100 text-gray-700 hover:bg-sky-50"}`}
                                >
                                    <Check size={14} className="inline mr-1 text-emerald-500" />
                                    Answers
                                </button>
                                <button
                                    onClick={() => setFilter("questions")}
                                    className={`px-3 py-1.5 rounded-lg text-sm ${filter === "questions" ? "bg-gradient-to-r from-sky-500/20 to-orange-500/20 text-sky-700 font-medium border border-sky-200/50" : "bg-white border border-sky-100 text-gray-700 hover:bg-sky-50"}`}
                                >
                                    <ChevronRight size={14} className="inline mr-1 text-orange-500" />
                                    Questions
                                </button>
                                <button
                                    onClick={() => setFilter("badges")}
                                    className={`px-3 py-1.5 rounded-lg text-sm ${filter === "badges" ? "bg-gradient-to-r from-sky-500/20 to-orange-500/20 text-sky-700 font-medium border border-sky-200/50" : "bg-white border border-sky-100 text-gray-700 hover:bg-sky-50"}`}
                                >
                                    <Badge size={14} className="inline mr-1 text-sky-500" />
                                    Badges
                                </button>
                                <button
                                    onClick={() => setFilter("streak")}
                                    className={`px-3 py-1.5 rounded-lg text-sm ${filter === "streak" ? "bg-gradient-to-r from-sky-500/20 to-orange-500/20 text-sky-700 font-medium border border-sky-200/50" : "bg-white border border-sky-100 text-gray-700 hover:bg-sky-50"}`}
                                >
                                    <Zap size={14} className="inline mr-1 text-amber-500" />
                                    Streak
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Top 3 Users */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Medal size={20} className="mr-2 text-amber-500" />
                            Top Contributors
                        </h2>

                        {isLoading ? (
                            <div className="flex justify-center gap-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="animate-pulse bg-white/80 rounded-xl p-6 shadow-sm border border-sky-100/50 w-full md:w-1/3 h-64 flex flex-col items-center"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {users.slice(0, 3).map((user) => (
                                    <div
                                        key={user.id}
                                        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-sky-100/50 hover:shadow-md transition-all flex flex-col items-center"
                                    >
                                        <div className="relative mb-4">
                                            <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${getAvatarBackground(user.rank || 0)} flex items-center justify-center shadow-md text-white text-2xl font-bold`}>
                                                {user.fullName.charAt(0)}
                                            </div>
                                            <div className="absolute -top-2 -right-2 bg-white rounded-full h-8 w-8 flex items-center justify-center border border-sky-100 shadow-sm">
                                                <Trophy size={16} className={user.rank === 1 ? "text-amber-500" : user.rank === 2 ? "text-slate-400" : "text-amber-800"} />
                                            </div>
                                        </div>

                                        <Link to={`/users/${user.id}`} className="text-lg font-semibold text-gray-900 hover:text-sky-600 mb-1">
                                            {user.fullName}
                                        </Link>

                                        <div className="flex items-center mb-3 text-amber-600">
                                            <Star size={16} className="mr-1" />
                                            <span className="font-semibold">{user.reputation.toLocaleString()}</span>
                                            <span className="ml-2 text-xs">{getRankChange(user.change)}</span>
                                        </div>

                                        <div className="flex justify-between w-full mb-4">
                                            <div className="text-center">
                                                <div className="text-sm font-medium text-gray-900">{user.questionsCount}</div>
                                                <div className="text-xs text-gray-600">Questions</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium text-gray-900">{user.answersCount}</div>
                                                <div className="text-xs text-gray-600">Answers</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium text-gray-900">{user.acceptRate}%</div>
                                                <div className="text-xs text-gray-600">Accept Rate</div>
                                            </div>
                                        </div>

                                        <div className="w-full pt-3 border-t border-sky-100/50">
                                            {renderBadges(user.badges)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Leaderboard Table */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-sky-100/50 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-sky-100/50">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <BarChart3 size={18} className="mr-2 text-sky-500" />
                                Rankings by {getFilterLabel(filter)}
                            </h2>
                            <div className="text-sm text-gray-600">{users.length} users</div>
                        </div>

                        {isLoading ? (
                            <div className="p-8">
                                <div className="animate-pulse space-y-4">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="bg-sky-50/50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reputation</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badges</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sky-100/50">
                                    {users.slice(0, 20).map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className={`hover:bg-sky-50/50 transition-colors ${index < 3 ? "bg-gradient-to-r from-sky-500/5 to-orange-500/5" : ""}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                            <span className={`flex items-center justify-center h-6 w-6 rounded-full ${index === 0 ? "bg-amber-100 text-amber-600" : index === 1 ? "bg-slate-100 text-slate-600" : index === 2 ? "bg-amber-50 text-amber-800" : "bg-gray-100 text-gray-600"} text-xs font-medium`}>
                              {index + 1}
                            </span>
                                                    <span className="ml-2">{getRankChange(user.change)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${getAvatarBackground(index + 1)} flex items-center justify-center shadow-sm text-white text-sm font-medium mr-3`}>
                                                        {user.fullName.charAt(0)}
                                                    </div>
                                                    <Link to={`/users/${user.id}`} className="text-sm font-medium text-gray-900 hover:text-sky-600">
                                                        {user.fullName}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm">
                                                    <Star size={14} className="mr-1 text-amber-500" />
                                                    <span className="font-medium">{user.reputation.toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {renderBadges(user.badges)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    <span className="text-gray-900">{user.answersCount}</span>
                                                    <span className="text-gray-500"> answers</span>
                                                    <span className="mx-1">·</span>
                                                    <span className="text-gray-900">{user.questionsCount}</span>
                                                    <span className="text-gray-500"> questions</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Zap size={14} className="mr-1 text-orange-500" />
                                                    <span className="text-sm font-medium">{user.streak} days</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="px-6 py-4 bg-gradient-to-r from-sky-500/5 to-orange-500/5 border-t border-sky-100/50 flex justify-center">
                            <button className="text-sky-600 hover:text-orange-500 font-medium transition-colors">
                                View All Rankings
                            </button>
                        </div>
                    </div>

                    {/* Achievements Section */}
                    <div className="mt-8 mb-12">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Gift size={20} className="mr-2 text-purple-500" />
                            Weekly Achievements
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-sky-100/50 hover:shadow-md transition-all">
                                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                    <Award size={16} className="mr-2 text-sky-500" />
                                    Most Answers
                                </h3>

                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-orange-400 flex items-center justify-center shadow-sm text-white text-sm font-medium mr-3">
                                        U
                                    </div>
                                    <div>
                                        <Link to="/users/5" className="text-base font-medium text-gray-900 hover:text-sky-600">
                                            User 5
                                        </Link>
                                        <div className="text-sm text-gray-600">97 answers this week</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-sky-100/50 hover:shadow-md transition-all">
                                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                    <Award size={16} className="mr-2 text-emerald-500" />
                                    Best Answer Rate
                                </h3>

                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-sm text-white text-sm font-medium mr-3">
                                        U
                                    </div>
                                    <div>
                                        <Link to="/users/12" className="text-base font-medium text-gray-900 hover:text-sky-600">
                                            User 12
                                        </Link>
                                        <div className="text-sm text-gray-600">92% accept rate</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-sky-100/50 hover:shadow-md transition-all">
                                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                    <Award size={16} className="mr-2 text-orange-500" />
                                    Highest Reputation Gain
                                </h3>

                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-400 flex items-center justify-center shadow-sm text-white text-sm font-medium mr-3">
                                        U
                                    </div>
                                    <div>
                                        <Link to="/users/8" className="text-base font-medium text-gray-900 hover:text-sky-600">
                                            User 8
                                        </Link>
                                        <div className="text-sm text-gray-600">+2,145 reputation</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;