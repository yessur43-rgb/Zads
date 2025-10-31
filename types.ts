
export interface ProductAnalysis {
  status: 'حلال' | 'حرام' | 'مشبوه';
  productName: string;
  ingredients: { name: string; status: 'حلال' | 'حرام' | 'مشبوه' }[];
  reasoning: string;
  healthInfo?: string;
  evidence?: string;
}

// FIX: Added to resolve error in components/Dashboard.tsx: Module '"../types"' has no exported member 'Tool'.
export enum Tool {
  ProductAnalyzer,
  FindPlaces,
  FindIt,
  MenuAnalyzer,
  ActivitiesFinder,
  OnMyWay,
  IngredientGuide,
  MySpace,
  Favorites,
}

// FIX: Added to resolve error in components/FindPlaces.tsx: Module '"../types"' has no exported member 'Place'.
export interface Place {
  name: string;
  category: string;
  rating?: number;
  distance: string;
  mapsLink: string;
}

// FIX: Added to support analyzeMenuImage function in geminiService.
export interface MenuItem {
  dishName: string;
  status: 'حلال' | 'حرام' | 'مشبوه';
  notes?: string;
}
