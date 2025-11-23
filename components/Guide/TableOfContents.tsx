import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export const TableOfContents: React.FC<{ content: string }> = ({ content }) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Simple regex to find markdown headers
    const lines = content.split('\n');
    const extracted: TOCItem[] = [];
    
    lines.forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        extracted.push({ id, text, level });
      }
    });

    setHeadings(extracted);
  }, [content]);

  return (
    <div className="hidden xl:block w-64 flex-shrink-0 pl-8">
      <div className="sticky top-24">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          <List className="w-4 h-4" />
          <span>On this page</span>
        </div>
        <nav className="space-y-1 relative">
          {/* Visual Track Line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-800" />
          
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`} // In a real implementation, we'd need to inject IDs into ReactMarkdown headers
              onClick={(e) => {
                 e.preventDefault();
                 // Scroll logic would go here
                 setActiveId(heading.id);
              }}
              className={cn(
                "block py-1.5 text-sm transition-colors pl-4 border-l-2 -ml-px",
                activeId === heading.id
                  ? "border-centri-500 text-centri-400 font-medium"
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600",
                heading.level === 3 && "pl-8"
              )}
            >
              {heading.text}
            </a>
          ))}
        </nav>
        
        <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-white/5 text-xs">
          <p className="text-slate-400 mb-2">Need more help?</p>
          <button className="text-centri-400 hover:underline">Ask AI Assistant →</button>
        </div>
      </div>
    </div>
  );
};