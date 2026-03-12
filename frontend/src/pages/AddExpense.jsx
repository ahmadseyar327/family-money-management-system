import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Save, X, DollarSign, Tag, User, Calendar, Plus, Trash2 } from 'lucide-react';

const AddExpense = () => {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);

    const initialExpense = {
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        spent_by_member_id: ''
    };

    const [expenses, setExpenses] = useState([{ ...initialExpense }]);
    const [loading, setLoading] = useState(false);

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
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const { data } = await api.get('/members');
            setMembers(data);
        } catch (err) { console.error(err); }
    };

    const handleChange = (index, field, value) => {
        const newExpenses = [...expenses];
        newExpenses[index][field] = value;
        setExpenses(newExpenses);
    };

    const addExpenseRow = () => {
        setExpenses([...expenses, { ...initialExpense }]);
    };

    const removeExpenseRow = (index) => {
        const newExpenses = expenses.filter((_, i) => i !== index);
        setExpenses(newExpenses);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await Promise.all(expenses.map(exp => api.post('/expenses', exp)));
            navigate('/expenses');
        } catch (err) {
            console.error('Error adding expenses:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-4 lg:py-12 px-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="text-center mb-8 lg:mb-12">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-100 tracking-tight">
                    Add Expenses
                </h1>
                <p className="mt-2 text-sm lg:text-lg text-gray-400">
                    Add one or multiple expenses at once
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {expenses.map((expense, index) => (
                    <div key={index} className="bg-gray-900 shadow-xl rounded-2xl lg:rounded-3xl p-6 lg:p-10 border border-gray-800 relative group animate-in slide-in-from-bottom-4 duration-300">
                        {expenses.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeExpenseRow(index)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors"
                                title="Remove Expense"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}

                        <div className="mb-6 border-b border-gray-800 pb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-sm">
                                    {index + 1}
                                </span>
                                Expense Details
                            </h3>
                        </div>

                        <div className="space-y-8">
                            {/* Amount & Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                        <DollarSign size={16} className="text-green-400" />
                                        Amount ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full bg-gray-800 text-white text-lg font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
                                        placeholder="0.00"
                                        value={expense.amount}
                                        onChange={(e) => handleChange(index, 'amount', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                        <Tag size={16} className="text-blue-400" />
                                        Category
                                    </label>
                                    <select
                                        className="w-full bg-gray-800 text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                                        value={expense.category}
                                        onChange={(e) => handleChange(index, 'category', e.target.value)}
                                        required
                                    >
                                        <option value="">Choose Category</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Member & Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                        <User size={16} className="text-purple-400" />
                                        Family Member
                                    </label>
                                    <select
                                        className="w-full bg-gray-800 text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
                                        value={expense.spent_by_member_id}
                                        onChange={(e) => handleChange(index, 'spent_by_member_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Who paid?</option>
                                        {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                        <Calendar size={16} className="text-yellow-400" />
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full bg-gray-800 text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        value={expense.date}
                                        onChange={(e) => handleChange(index, 'date', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300">Description</label>
                                <textarea
                                    className="w-full bg-gray-800 text-white py-4 px-4 rounded-xl min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-500"
                                    placeholder="E.g., Weekly Groceries, Electricity Bill"
                                    value={expense.description}
                                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Another Button */}
                <button
                    type="button"
                    onClick={addExpenseRow}
                    className="w-full py-4 border-2 border-dashed border-gray-700 hover:border-indigo-500 hover:bg-indigo-500/5 text-gray-400 hover:text-indigo-400 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                    <Plus size={20} /> Add Another Expense
                </button>

                {/* Final Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                        type="button"
                        className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl border border-gray-700 flex items-center justify-center gap-3 transition-all"
                        onClick={() => navigate(-1)}
                    >
                        <X size={20} /> Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-[2] py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-70"
                        disabled={loading || expenses.length === 0}
                    >
                        <Save size={22} /> {loading ? 'Saving...' : `Save ${expenses.length > 1 ? 'All Expenses' : 'Expense'}`}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddExpense;