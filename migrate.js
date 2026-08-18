const fs = require('fs');

let html = fs.readFileSync('legacy/index.html', 'utf8');

// Replace class with className
html = html.replace(/class=/g, 'className=');

// Remove comments
html = html.replace(/<!--[\s\S]*?-->/g, '');

// Extract body
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
let bodyContent = bodyMatch ? bodyMatch[1] : html;

// Remove scripts
bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

// Self-close tags
bodyContent = bodyContent.replace(/<img([^>]*)>/g, '<img$1 />');
bodyContent = bodyContent.replace(/<br([^>]*)>/g, '<br$1 />');
bodyContent = bodyContent.replace(/<input([^>]*)>/g, '<input$1 />');
bodyContent = bodyContent.replace(/<textarea([^>]*)><\/textarea>/g, '<textarea$1 />');

const pageContent = `import Script from 'next/script';
import WorkSection from '@/components/WorkSection';

export default function Home() {
  return (
    <main>
      ${bodyContent}
      <Script src="https://unpkg.com/@phosphor-icons/web" strategy="beforeInteractive" />
    </main>
  );
}`;

fs.writeFileSync('src/app/page.tsx', pageContent);
