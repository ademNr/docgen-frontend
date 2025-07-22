// src/utils/markdownUtils.ts
import { Documentation } from '../types/documentation';

// Helper function to encode badge text as per shield.io rules
const encodeBadgeText = (text: string): string => {
    return text
        .replace(/-/g, '--')
        .replace(/_/g, '__')
        .replace(/ /g, '_');
};

export const generateMarkdown = (documentation: Documentation): string => {
    const { title, description, tagline, badges, features, techStack, installation, usage, api, fileStructure, contributing, license, author } = documentation;

    return `
# ${title}

> ${tagline}

${badges.map(b => {
        const label = encodeBadgeText(b.label);
        const status = encodeBadgeText(b.status);
        let color = b.color;
        if (color.startsWith('#')) {
            color = color.substring(1);
        }
        return `![${b.label}](https://img.shields.io/badge/${label}-${status}-${color})`;
    }).join(' ')}

## 📝 Description
${description}

## ✨ Features
${features.map(f => `- ${f}`).join('\n')}
    
## 🛠️ Tech Stack
${techStack.map(tech => `- ${tech.name}`).join('\n')}
    
## ⚙️ Installation
### Requirements
${installation.requirements.map(r => `- ${r}`).join('\n')}
    
### Steps
${installation.steps.join('\n')}
    
## 🚀 Usage
### Basic
${usage.basic}
    
### Advanced
${usage.advanced}
    
## 🌐 API Reference
${api.map(endpoint => `
### \`${endpoint.method} ${endpoint.endpoint}\`
${endpoint.description}
    
**Parameters:**
${endpoint.parameters.map(p => `- \`${p.name}\` (${p.type})${p.required ? ' [required]' : ''}: ${p.description || ''}`).join('\n')}
    
**Example:**
\`\`\`bash
${endpoint.example}
\`\`\`
`).join('\n')}
    
## 📂 File Structure
${fileStructure.map(f => `- \`${f.path}\`: ${f.description}`).join('\n')}
    
## 🤝 Contributing
### Setup
${contributing.setup}
    
### Guidelines
${contributing.guidelines}
    
### Process
${contributing.process}
    
## 📜 License
This project is licensed under the ${license} License.
    
## 👤 Author
${author}
    `.trim();
};