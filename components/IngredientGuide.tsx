
import React, { useState } from 'react';
import LoadingSpinner from './common/LoadingSpinner';
import * as geminiService from '../services/geminiService';
import { FlaskConical, Search } from 'lucide-react';

const IngredientGuide: React.FC = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await geminiService.getIngredientInfo(query);
            setResult(response);
        } catch (err) {
            setError('حدث خطأ أثناء البحث عن المكون.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="text-center p-6 bg-primary-light dark:bg-primary-dark rounded-xl shadow-lg">
                <FlaskConical className="mx-auto w-12 h-12 text-white mb-2" />
                <h2 className="text-2xl font-bold text-white">دليل المكونات</h2>
                <p className="text-white/80">ابحث عن E-numbers أو أسماء المكونات</p>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="مثال: E471، جيلاتين..."
                    className="flex-grow p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="p-3 bg-primary text-white rounded-lg font-semibold shadow-md hover:bg-primary-dark transition-colors disabled:opacity-50"
                    disabled={loading || !query.trim()}
                >
                    <Search />
                </button>
            </form>

            {loading && <LoadingSpinner message="جاري البحث..." />}
            
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
            
            {result && (
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md animate-fade-in">
                    <div className="prose prose-sm sm:prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }}>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IngredientGuide;
