// components/TabContent.tsx
import React, { memo } from 'react';
import { Documentation } from '../../types/documentation';
import ReadmePreview from './ReadmePreview';
import BestPracticesView from './BestPractices';

interface TabProps {
    activeTab: string;
    documentation: Documentation;
}

const TabContent = memo(({ activeTab, documentation }: TabProps) => {
    if (activeTab === 'readme') {
        return <ReadmePreview documentation={documentation} />;
    }
    return documentation.bestPractices ? (
        <BestPracticesView data={documentation.bestPractices} />
    ) : (
        <p>No best practices available</p>
    );
});
TabContent.displayName = 'TabContent';
export default TabContent;