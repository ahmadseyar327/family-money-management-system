import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-bg-main relative">
            {/* Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} closeMobileMenu={() => setIsSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">
                <header className="sticky top-0 z-30 h-16 lg:h-20 bg-[#020617]/80 dark:glass-panel border-b border-white/5 flex items-center justify-between px-4 sm:px-6 lg:px-8 backdrop-blur-md">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent truncate">
                            Financial Overview
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden xs:block px-3 py-1 rounded-full bg-slate-900/50 border border-white/5 text-[10px] font-semibold text-slate-400">
                            Family Account
                        </div>
                    </div>
                </header>
                <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
