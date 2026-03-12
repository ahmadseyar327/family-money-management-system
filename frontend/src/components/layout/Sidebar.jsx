import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ArrowUpCircle,
    ArrowDownCircle,
    PlusCircle,
    Wallet,
    LogOut,
    User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, closeMobileMenu }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        if (closeMobileMenu) closeMobileMenu();
    };

    const menuItems = [
        { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/members', name: 'Members', icon: <Users size={20} /> },
        { path: '/income', name: 'Income', icon: <ArrowUpCircle size={20} /> },
        { path: '/expenses', name: 'Expenses', icon: <ArrowDownCircle size={20} /> },
        { path: '/add-expense', name: 'Add Expense', icon: <PlusCircle size={20} /> },
    ];

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-white/5 bg-slate-950/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 lg:static lg:flex lg:h-screen ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="flex items-center gap-3 px-8 py-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 ring-1 ring-indigo-500/20">
                    <Wallet size={24} />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">FamilyMoney</h1>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all group ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <span className="transition-colors">{item.icon}</span>
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 space-y-3 border-t border-white/5">
                {user && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/50 border border-white/5">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 ring-1 ring-indigo-500/20">
                            <User size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active User</p>
                            <p className="text-xs font-medium text-slate-200 truncate">{user.email}</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

