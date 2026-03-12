import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserPlus, Edit2, Trash2, Shield } from 'lucide-react';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const { data } = await api.get('/members');
            setMembers(data);
        } catch (err) {
            console.error('Error fetching members:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/members/${editingId}`, { name, role });
            } else {
                await api.post('/members', { name, role });
            }
            setName('');
            setRole('');
            setEditingId(null);
            fetchMembers();
        } catch (err) {
            console.error('Error saving member:', err);
        }
    };

    const handleEdit = (member) => {
        setName(member.name);
        setRole(member.role);
        setEditingId(member.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this member?')) {
            try {
                await api.delete(`/members/${id}`);
                fetchMembers();
            } catch (err) {
                console.error('Error deleting member:', err);
            }
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-white">Family Members</h1>
                <p className="text-gray-400">Manage who's tracking their money and their roles</p>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

                {/* Add/Edit Member Form */}
                <div className="bg-gray-900 rounded-3xl shadow-lg ring-1 ring-gray-800 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                            <UserPlus size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                            {editingId ? 'Edit Member' : 'Add New Member'}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-400">Member Name</label>
                            <input
                                type="text"
                                className="w-full bg-gray-800 text-white py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter name"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-400">Family Role</label>
                            <select
                                className="w-full bg-gray-800 text-white py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Son">Son</option>
                                <option value="Daughter">Daughter</option>
                                <option value="Grandparent">Grandparent</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                                <UserPlus size={18} />
                                {editingId ? 'Update' : 'Add'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-all"
                                    onClick={() => { setEditingId(null); setName(''); setRole(''); }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Members Table */}
                <div className="bg-gray-900 rounded-3xl shadow-lg ring-1 ring-gray-800 overflow-x-auto xl:col-span-2">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50 border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Member</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Role</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Joined</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {members.map(member => (
                                <tr key={member.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-800 text-gray-300 ring-1 ring-gray-700 group-hover:ring-primary/50 transition-all font-bold">
                                                {member.name.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-white">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary ring-1 ring-primary/20">
                                            <Shield size={12} />
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {new Date(member.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(member)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                className="p-2 rounded-lg hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {members.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center text-gray-500 italic">
                                        No family members found. Add one to get started!
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

export default Members;