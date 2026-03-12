import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, User } from 'lucide-react';

const Income = () => {
    const [income, setIncome] = useState([]);
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        amount: '',
        source: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        added_by_member_id: ''
    });

    useEffect(() => {
        fetchIncome();
        fetchMembers();
    }, []);

    const fetchIncome = async () => {
        try {
            const { data } = await api.get('/income');
            setIncome(data);
        } catch (err) { console.error(err); }
    };

    const fetchMembers = async () => {
        try {
            const { data } = await api.get('/members');
            setMembers(data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/income', formData);
            setFormData({
                amount: '',
                source: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                added_by_member_id: ''
            });
            fetchIncome();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this record?')) {
            try {
                await api.delete(`/income/${id}`);
                fetchIncome();
            } catch (err) { console.error(err); }
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-white">Income Tracking</h1>
                <p className="text-gray-400">Monitor all incoming family funds and contributions</p>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

                {/* Add Income Form */}
                <div className="bg-gray-900 rounded-3xl shadow-lg ring-1 ring-gray-800 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                            <Plus size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Add Income</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-400">Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full bg-gray-800 text-white py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-400">Source</label>
                            <input
                                type="text"
                                className="w-full bg-gray-800 text-white py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                placeholder="Salary, Dividend..."
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-400">Family Member</label>
                            <select
                                className="w-full bg-gray-800 text-white py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                value={formData.added_by_member_id}
                                onChange={(e) => setFormData({ ...formData, added_by_member_id: e.target.value })}
                                required
                            >
                                <option value="">Select Member</option>
                                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-400">Date</label>
                            <input
                                type="date"
                                className="w-full bg-gray-800 text-white py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-400">Description</label>
                            <textarea
                                className="w-full bg-gray-800 text-white py-2 px-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm min-h-[100px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Details..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                        >
                            <Plus size={18} /> Add Income
                        </button>
                    </form>
                </div>

                {/* Income Table */}
                <div className="bg-gray-900 rounded-3xl shadow-lg ring-1 ring-gray-800 overflow-x-auto xl:col-span-2">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50 border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Source</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Member</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Date</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-right">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {income.map(item => (
                                <tr key={item.id} className="group hover:bg-emerald-500/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-semibold">{item.source}</span>
                                            <span className="text-xs text-gray-400">{item.description || 'No description'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-emerald-500 font-bold">+${parseFloat(item.amount).toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 w-fit">
                                            <User size={12} className="text-gray-400" />
                                            <span className="text-xs text-gray-300 font-medium">{item.member_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 rounded-lg hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition-all font-bold"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {income.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-gray-500 italic">
                                        No income records found.
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

export default Income;