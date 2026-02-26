'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';

interface Props {
    values: string[];
    onChange: (urls: string[]) => void;
    max?: number;
}

export default function MultiImageUpload({ values, onChange, max = 5 }: Props) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Выберите файл.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('images').getPublicUrl(fileName);
            onChange([...values, data.publicUrl]);
        } catch (error: any) {
            alert('Ошибка загрузки фото: ' + error.message);
        } finally {
            setUploading(false);
            // Reset input so the same file can be selected again
            event.target.value = '';
        }
    };

    const removeImage = (index: number) => {
        onChange(values.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            {/* Grid of uploaded images */}
            {values.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {values.map((url, i) => (
                        <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-[4/3]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Фото ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1.5 rounded-full shadow hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                                {i + 1}/{values.length}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload button */}
            {values.length < max && (
                <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-[#C5A059] hover:bg-[#FCFAF7] transition cursor-pointer bg-white">
                    {uploading ? (
                        <div className="flex flex-col items-center animate-pulse">
                            <span className="text-[#C5A059] font-bold text-sm">Загрузка на сервер...</span>
                        </div>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-xs font-medium">
                                Добавить фото ({values.length}/{max})
                            </span>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            )}
        </div>
    );
}
