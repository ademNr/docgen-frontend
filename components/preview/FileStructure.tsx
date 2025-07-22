import React from 'react';
import { FileStructureItem } from '../../types/documentation';
import { FolderIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface FileStructureProps {
    structure: FileStructureItem[];
}

const FileStructure: React.FC<FileStructureProps> = ({ structure }) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <ul>
                {structure.map((item, index) => (
                    <li key={index} className="py-1">
                        <div className="flex items-start">
                            {item.path.endsWith('/') ? (
                                <FolderIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                            ) : (
                                <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                                <span className="font-mono text-sm">{item.path}</span>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileStructure;