
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the "data:image/jpeg;base64," part
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const getStatusColor = (status: 'حلال' | 'حرام' | 'مشبوه') => {
    switch (status) {
        case 'حلال':
            return 'bg-green-100 text-green-800 border-green-400';
        case 'حرام':
            return 'bg-red-100 text-red-800 border-red-400';
        case 'مشبوه':
            return 'bg-yellow-100 text-yellow-800 border-yellow-400';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-400';
    }
};

export const getStatusRingColor = (status: 'حلال' | 'حرام' | 'مشبوه') => {
    switch (status) {
        case 'حلال':
            return 'ring-green-500';
        case 'حرام':
            return 'ring-red-500';
        case 'مشبوه':
            return 'ring-yellow-500';
        default:
            return 'ring-gray-500';
    }
};
