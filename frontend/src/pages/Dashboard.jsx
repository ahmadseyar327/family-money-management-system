import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line
} from 'recharts';

const StatCard = ({ title, amount, icon, color }) => {
    const colorMap = {
        success: 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20',
        error: 'bg-rose-500/10 text-rose-500 ring-rose-500/20',
        primary: 'bg-indigo-500/10 text-indigo-500 ring-indigo-500/20',
    };

    return (
        <div className={`p-4 sm:p-6 flex items-center gap-4 sm:gap-5 rounded-2xl bg-gray-900 ring-1 ring-gray-800 transition-transform hover:scale-105 shadow-none`}>
            <div className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl text-xl sm:text-2xl ${colorMap[color]}`}>
                {icon}
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</span>
                <span className="text-xl sm:text-2xl font-bold text-white mt-0.5 truncate">${amount.toLocaleString()}</span>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [memberSpending, setMemberSpending] = useState([]);
    const [monthlyTrends, setMonthlyTrends] = useState([]);
    const [categorySpending, setCategorySpending] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (selectedMonth) params.append('month', selectedMonth);
                if (selectedYear) params.append('year', selectedYear);
                const queryString = params.toString() ? `?${params.toString()}` : '';

                const yearParams = new URLSearchParams();
                if (selectedYear) yearParams.append('year', selectedYear);
                const yearQueryString = yearParams.toString() ? `?${yearParams.toString()}` : '';

                const [sumRes, memRes, monthRes, catRes] = await Promise.all([
                    api.get(`/analytics/summary${queryString}`),
                    api.get(`/analytics/member-spending${queryString}`),
                    api.get(`/analytics/monthly${yearQueryString}`),
                    api.get(`/analytics/categories${queryString}`)
                ]);
                setSummary(sumRes.data);
                setMemberSpending(memRes.data);
                setMonthlyTrends(monthRes.data);
                setCategorySpending(catRes.data);
            } catch (err) {
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedMonth, selectedYear]);

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent shadow-lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900 p-4 rounded-2xl ring-1 ring-gray-800 shadow-none">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500 shrink-0">
                        <Calendar size={20} />
                    </div>
                    <h2 className="text-white font-semibold flex-1">Dashboard Overview</h2>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : '')}
                        className="bg-slate-950 text-white px-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 flex-1 sm:flex-none cursor-pointer"
                    >
                        <option value="">All Months</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : '')}
                        className="bg-slate-950 text-white px-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 flex-1 sm:flex-none cursor-pointer"
                    >
                        <option value="">All Years</option>
                        {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - 2 + i;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <StatCard title="Total Income" amount={summary.totalIncome} icon={<TrendingUp size={24} />} color="success" />
                <StatCard title="Total Expenses" amount={summary.totalExpense} icon={<TrendingDown size={24} />} color="error" />
                <StatCard title="Remaining Balance" amount={summary.balance} icon={<Wallet size={24} />} color="primary" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Expenses by Category */}
                <div className="bg-gray-900 rounded-3xl p-6 shadow-lg ring-1 ring-gray-800">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                        Expenses by Category
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categorySpending}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={6}
                                    dataKey="value"
                                    nameKey="category"
                                    stroke="none"
                                >
                                    {categorySpending.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                    }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Spending by Member */}
                <div className="bg-gray-900 rounded-3xl p-6 shadow-lg ring-1 ring-gray-800">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Spending by Member
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={memberSpending}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Bar dataKey="total_spent" fill="#6366f1" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Spending Trend */}
                <div className="bg-gray-900 rounded-3xl p-6 shadow-lg ring-1 ring-gray-800 lg:col-span-2">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                        Monthly Spending Trend
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Line type="monotone" dataKey="total_spent" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#020617' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;