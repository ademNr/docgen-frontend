// components/ActionButtons.tsx
import React, { memo } from 'react';

interface ButtonProps {
    onCopy: () => void;
    onDownload: () => void;
    copySuccess: boolean;
    downloadProgress: number;
}

const ActionButtons = memo(({
    onCopy,
    onDownload,
    copySuccess,
    downloadProgress
}: ButtonProps) => (
    <div className="flex gap-2">
        <button onClick={onCopy} disabled={copySuccess}>
            {copySuccess ? 'Copied!' : 'Copy README'}
        </button>
        <button
            onClick={onDownload}
            disabled={downloadProgress > 0 && downloadProgress < 100}
        >
            {downloadProgress > 0 ? `${downloadProgress}%` : 'Download'}
        </button>
    </div>
));

export default ActionButtons;