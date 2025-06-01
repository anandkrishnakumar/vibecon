import { useRef } from "react";
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

interface ExportVibeCardProps {
    cardRef: React.RefObject<HTMLDivElement>;
}

export default function ExportVibeCard({ cardRef }: ExportVibeCardProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const downloadButtonRef = useRef<HTMLButtonElement>(null);

    function dataURLtoBlob(dataurl: string) {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || '';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    const handleShare = () => {
        if (!cardRef.current) return;
        toPng(cardRef.current, {
            filter: (node) => {
                // Exclude both buttons from the image
                return node !== buttonRef.current && node !== downloadButtonRef.current;
            },
        }).then((dataUrl) => {
            const file = new File([dataURLtoBlob(dataUrl)], 'vibe.png', { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    text: 'my mood today',
                });
            } else {
                alert("Sharing not supported on this device.");
            }
        });
    };

    const handleDownload = () => {
        if (!cardRef.current) return;
        toPng(cardRef.current, {
            filter: (node) => {
                // Exclude both buttons from the image
                return node !== buttonRef.current && node !== downloadButtonRef.current;
            },
        }).then((dataUrl) => {
            saveAs(dataUrl, 'vibe.png');
        });
    };

    return (
        <div className="text-center mt-6">
            <button
                ref={buttonRef}
                className="bg-blue-500 text-white p-3 rounded-full mt-4 mr-3 hover:bg-blue-600 transition-colors"
                onClick={handleShare}
                title="Share Vibe"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16,6 12,2 8,6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
            </button>
            <button
                ref={downloadButtonRef}
                className="bg-green-500 text-white p-3 rounded-full mt-4 hover:bg-green-600 transition-colors"
                onClick={handleDownload}
                title="Download Vibe"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
            </button>
        </div>
    );
}