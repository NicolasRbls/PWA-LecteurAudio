import { useRef, useState } from 'react';
import { importFiles } from '../services/importService';

export const ImportButton = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImporting(true);
            try {
                await importFiles(e.target.files);
            } catch (err) {
                console.error(err);
            } finally {
                setImporting(false);
                if (inputRef.current) inputRef.current.value = '';
            }
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="audio/*"
            />
            <button
                onClick={() => inputRef.current?.click()}
                disabled={importing}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
                {importing ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Importing...
                    </>
                ) : (
                    <>
                        <span className="mr-2">＋</span> Add Music
                    </>
                )}
            </button>
        </div>
    );
}
