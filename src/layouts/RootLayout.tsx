import React from 'react';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import { Toaster } from '@/components/ui/toaster';

const RootLayout = ({ children }: { children: React.ReactNode }) => {  
    return (
        <div className="w-full min-h-screen bg-gray-100">
            <div className="max-w-screen-xl mx-auto pt-10">
                <Header />
                <main>{children}</main>
                <Footer /> 
            </div>
            <Toaster /> 
        </div>
    );
};

export default RootLayout;