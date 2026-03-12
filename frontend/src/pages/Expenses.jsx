import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Filter, Trash2, Tag } from 'lucide-react';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [members, setMembers] = useState([]);
    const [filters, setFilters] = useState({
        member: '',
        category: '',
        startDate: '',
        endDate: ''
    });

    const categories = [
        'Food & Dining',
        'Groceries',
        'Rent & Mortgage',
        'Utilities',
        'Shopping',
        'Travel & Transport',
        'Health & Fitness',
        'Education',
        'Entertainment',
        'Personal Care',
        'Home Improvement',
        'Gifts & Donations',
        'Insurance',
        'Investments',
        'Debt Repayment',
        'Childcare',
        'Pets',
        'Hobbies',
        'Subscriptions',
        'Miscellaneous',
        'Other'
    ];

    useEffect(() => {
        fetchExpenses();
        fetchMembers();
    }, []);

    const fetchExpenses = async () => {
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            const { data } = await api.get(`/expenses?${params.toString()}`);
            setExpenses(data);
        } catch (err) { console.error(err); }
    };

    const fetchMembers = async () => {
        try {
            const { data } = await api.get('/members');
            setMembers(data);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this expense?')) {
            try {
                await api.delete(`/expenses/${id}`);
                fetchExpenses();
            } catch (err) { console.error(err); }
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Expense Records</h1>
                <p className="text-sm lg:text-base text-gray-400">Track and filter all household expenditures</p>
            </div>

            {/* Filters */}
            <div className="bg-gray-900 p-5 lg:p-6 rounded-2xl lg:rounded-3xl shadow-lg ring-1 ring-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
                    {/* Member Filter */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Family Member</label>
                        <select
                            name="member"
                            className="w-full bg-gray-800 text-white py-2.5 px-3.5 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all"
                            value={filters.member}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Members</option>
                            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Category</label>
                        <select
                            name="category"
                            className="w-full bg-gray-800 text-white py-2.5 px-3.5 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all"
                            value={filters.category}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Start Date */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">From Date</label>
                        <input
                            type="date"
                            name="startDate"
                            className="w-full bg-gray-800 text-white py-2.5 px-3.5 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-sm transition-all"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* End Date */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">To Date</label>
                        <input
                            type="date"
                            name="endDate"
                            className="w-full bg-gray-800 text-white py-2.5 px-3.5 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm transition-all"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* Apply Button */}
                    <button
                        className="w-full sm:col-span-2 lg:col-span-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20"
                        onClick={fetchExpenses}
                    >
                        <Filter size={18} /> Apply
                    </button>
                </div>
            </div>

            {/* Expense Table Container */}
            <div className="bg-gray-900 rounded-2xl lg:rounded-3xl shadow-lg ring-1 ring-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-gray-800/50 border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Description</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Category</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Member</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Date</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-right">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {expenses.map(exp => (
                                <tr key={exp.id} className="group hover:bg-rose-500/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-white font-semibold">{exp.description || 'No description'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 text-xs font-semibold text-gray-300 w-fit">
                                            <Tag size={12} className="text-gray-500" />
                                            {exp.category}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 shrink-0 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 uppercase">
                                                {exp.member_name.charAt(0)}
                                            </div>
                                            <span className="text-sm text-gray-300 font-medium">{exp.member_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-rose-500 font-bold">-${parseFloat(exp.amount).toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{new Date(exp.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(exp.id)}
                                            className="p-2 rounded-lg hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition-all font-bold"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center text-gray-500 italic">
                                        No expenses found matching the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Expenses;