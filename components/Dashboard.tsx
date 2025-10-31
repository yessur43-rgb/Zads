
import React from 'react';
import { Tool } from '../types';
import { Scan, MessageSquare, Search, UtensilsCrossed, PartyPopper, Route, FlaskConical, User, Heart, Sun, Moon } from 'lucide-react';

interface ToolInfo {
  id: Tool;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const tools: ToolInfo[] = [
  { id: Tool.ProductAnalyzer, title: 'تحليل المنتج', description: 'تحقق من حلال/حرام المنتجات', icon: Scan, color: 'bg-teal-500' },
  { id: Tool.FindPlaces, title: 'ابحث عن أماكن', description: 'مطاعم ومقاهي قريبة', icon: MessageSquare, color: 'bg-blue-500' },
  { id: Tool.FindIt, title: 'أوجدها لي', description: 'ابحث عن منتجات ومتاجر', icon: Search, color: 'bg-purple-500' },
  { id: Tool.MenuAnalyzer, title: 'تحليل القائمة', description: 'حلل قوائم المطاعم تلقائياً', icon: UtensilsCrossed, color: 'bg-red-500' },
  { id: Tool.ActivitiesFinder, title: 'الأنشطة', description: 'اكتشف أنشطة وفعاليات', icon: PartyPopper, color: 'bg-pink-500' },
  { id: Tool.OnMyWay, title: 'على طريقي', description: 'أماكن على طريق رحلتك', icon: Route, color: 'bg-orange-500' },
  { id: Tool.IngredientGuide, title: 'دليل المكونات', description: 'معلومات عن المكونات الغذائية', icon: FlaskConical, color: 'bg-yellow-500' },
  { id: Tool.MySpace, title: 'مساحتي', description: 'دفتر رحلات شخصي ذكي', icon: User, color: 'bg-green-500' },
  { id: Tool.Favorites, title: 'المفضلة', description: 'احفظ أماكنك المفضلة', icon: Heart, color: 'bg-rose-500' },
];

interface DashboardProps {
  onSelectTool: (tool: Tool) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ToolCard: React.FC<{ tool: ToolInfo; onClick: () => void }> = ({ tool, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-start"
  >
    <div className={`p-3 rounded-full ${tool.color} text-white mb-4 shadow-md`}>
      <tool.icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{tool.title}</h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm">{tool.description}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool, isDarkMode, toggleDarkMode }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <header className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark dark:text-primary-light">زاد (ZAD)</h1>
          <p className="text-gray-600 dark:text-gray-300">رفيقك في السفر والمطاعم الحلال</p>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-700" />}
        </button>
      </header>
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <ToolCard key={tool.id} tool={tool} onClick={() => onSelectTool(tool.id)} />
        ))}
      </main>
    </div>
  );
};

export default Dashboard;
