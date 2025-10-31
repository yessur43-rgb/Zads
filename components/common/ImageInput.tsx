
import React, { useRef, useState } from 'react';
import { Camera, ImageUp, ScanBarcode } from 'lucide-react';

interface ImageInputProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

  return (
    <div className="w-full space-y-4">
      {preview ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
          <img src={preview} alt="معاينة" className="w-full h-full object-contain" />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <p className="text-gray-500 dark:text-gray-400">اختر صورة للتحليل</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold shadow-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ImageUp size={20} />
          <span>رفع صورة</span>
        </button>
        <button
          onClick={() => cameraInputRef.current?.click()}
          disabled={disabled}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-secondary text-gray-900 rounded-lg font-semibold shadow-md hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera size={20} />
          <span>التقاط صورة</span>
        </button>
         <button
          onClick={() => alert("ميزة مسح الباركود قيد التطوير!")}
          disabled={disabled}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-500 text-white rounded-lg font-semibold shadow-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ScanBarcode size={20} />
          <span>مسح باركود</span>
        </button>
      </div>
    </div>
  );
};

export default ImageInput;
