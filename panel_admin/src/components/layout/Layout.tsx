import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';

interface LayoutProps {
    children: ReactNode;
    activeSection: string;
    setActiveSection: (section: string) => void;
}

export default function Layout({ children, activeSection, setActiveSection }: LayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-earth-50 flex">
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />

            <div className="flex-1 lg:ml-72 flex flex-col min-h-screen transition-all">
                <Navbar
                    title={activeSection}
                />

                <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full pb-32 lg:pb-10 animate-in fade-in duration-500">
                    {children}
                </main>
            </div>

            <MobileBottomNav
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />
        </div>
    );
}
