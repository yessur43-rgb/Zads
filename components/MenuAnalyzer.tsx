
import React, { useState } from 'react';
import ImageInput from './common/ImageInput';
import LoadingSpinner from './common/LoadingSpinner';
import * as geminiService from '../services/geminiService';
import { fileToBase64, getStatusColor } from '../utils/helpers';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface MenuItem {
    dishName: string;
    status: 'حلال' | 'حرام' | 'مشبوه';
    notes?: string;
}

const MenuAnalyzer: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleMenuAnalysis = async (file: File) => {
        setLoading(true);
        setMenuItems(null);
        setError(null);
        try {
            const base64Image = await fileToBase64(file);
            const result = await geminiService.analyzeMenuImage(base64Image);
            if (result && Array.isArray(result)) {
                setMenuItems(result);
            } else {
                setError('لم نتمكن من تحليل القائمة. تأكد من أن الصورة واضحة.');
            }
        } catch (err) {
            setError('حدث خطأ أثناء معالجة الصورة.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const StatusIcon = ({ status }: { status: MenuItem['status'] }) => {
        switch (status) {
        case 'حلال': return <ShieldCheck className="w-5 h-5 text-green-600" />;
        case 'حرام': return <ShieldX className="w-5 h-5 text-red-600" />;
        case 'مشبوه': return <ShieldAlert className="w-5 h-5 text-yellow-600" />;
        default: return null;
        }
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <ImageInput onImageSelect={handleMenuAnalysis} disabled={loading} />
            
            {loading && <LoadingSpinner message="جاري تحليل قائمة الطعام..." />}
            
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
            
            {menuItems && (
                <div className="space-y-4 animate-fade-in">
                    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">نتائج تحليل القائمة</h2>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {menuItems.map((item, index) => (
                            <li key={index} className="py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <StatusIcon status={item.status} />
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.dishName}</h3>
                                    </div>
                                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>
                                {item.notes && (
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 pr-8">{item.notes}</p>
                                )}
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuAnalyzer;
