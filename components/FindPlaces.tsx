import React, { useState, useEffect } from 'react';
import * as geminiService from '../services/geminiService';
import { Place } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import { Search, MapPin, Star, Utensils, Landmark, AlertTriangle } from 'lucide-react';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className="flex text-yellow-400">
            {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} fill="currentColor" size={16} />)}
            {/* Note: No half star for simplicity, can be added later */}
            {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} size={16} />)}
        </div>
    );
};

const PlaceCard: React.FC<{ place: Place }> = ({ place }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-start gap-4 transition-transform transform hover:scale-105">
        <div className="p-3 bg-primary-light dark:bg-primary-dark text-white rounded-full">
            {place.category.includes('مطعم') ? <Utensils size={24} /> : <Landmark size={24} />}
        </div>
        <div className="flex-grow">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{place.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{place.category}</p>
            <div className="flex items-center justify-between mt-2">
                <StarRating rating={place.rating || 0} />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{place.distance}</span>
            </div>
        </div>
         <a href={place.mapsLink} target="_blank" rel="noopener noreferrer" className="self-center p-3 text-primary dark:text-primary-light hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label="عرض على الخريطة">
            <MapPin size={24} />
        </a>
    </div>
);


const FindPlaces: React.FC = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('جاري تحديد موقعك...');
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [results, setResults] = useState<Place[] | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setLoading(false);
            },
            (err) => {
                setError('يرجى تمكين الوصول إلى الموقع لاستخدام هذه الميزة.');
                setLoading(false);
                console.error(err);
            }
        );
    }, []);

    const handleSearch = async (searchQuery: string) => {
        if (!location) {
            setError('لا يمكن البحث بدون تحديد الموقع.');
            return;
        }
        if (!searchQuery.trim()) return;

        setLoading(true);
        setLoadingMessage('جاري البحث عن أماكن قريبة...');
        setResults(null);
        setError(null);

        try {
            const response = await geminiService.findPlacesNearby(searchQuery, location);
            if(response && Array.isArray(response)) {
                 setResults(response as Place[]);
            } else {
                setError("لم نتمكن من العثور على أماكن. حاول البحث بكلمات مختلفة.");
            }
        } catch (err) {
            setError('حدث خطأ أثناء البحث.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(query);
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="text-center p-6 bg-blue-500 dark:bg-blue-800/50 rounded-xl shadow-lg">
                <Utensils className="mx-auto w-12 h-12 text-white mb-2" />
                <h2 className="text-2xl font-bold text-white">ابحث عن أماكن</h2>
                <p className="text-white/80">مطاعم حلال، مساجد، والمزيد بالقرب منك</p>
            </div>

            <div className="flex gap-2 justify-center">
                 <button onClick={() => handleSearch('مطاعم حلال')} disabled={loading || !location} className="px-4 py-2 bg-primary text-white rounded-full font-semibold shadow-md disabled:opacity-50">مطاعم حلال</button>
                 <button onClick={() => handleSearch('مساجد')} disabled={loading || !location} className="px-4 py-2 bg-secondary text-gray-900 rounded-full font-semibold shadow-md disabled:opacity-50">مساجد</button>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="مثال: شاورما، مقهى عائلي..."
                    className="flex-grow p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={loading || !location}
                />
                <button
                    type="submit"
                    className="p-3 bg-primary text-white rounded-lg font-semibold shadow-md hover:bg-primary-dark transition-colors disabled:opacity-50"
                    disabled={loading || !location || !query.trim()}
                >
                    <Search />
                </button>
            </form>

            {loading && <LoadingSpinner message={loadingMessage} />}
            
            {error && 
                <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center flex items-center justify-center gap-2">
                    <AlertTriangle /> {error}
                </div>
            }
            
            {results && (
                <div className="space-y-4 animate-fade-in">
                    {results.length > 0 ? (
                        results.map((place, index) => <PlaceCard key={index} place={place} />)
                    ) : (
                         <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg text-center">
                           لم يتم العثور على نتائج.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FindPlaces;