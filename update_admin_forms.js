const fs = require('fs');

const FILE_PATH = 'src/app/admin/page.tsx';

let code = fs.readFileSync(FILE_PATH, 'utf8');

// Replace all labels
code = code.replace(/<label\s+className="[^"]*"/g, '<label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block"');

// Replace all inputs
code = code.replace(/<input\s+([^>]*?)className="[^"]*"/g, '<input $1className="w-full bg-gray-900/50 border border-gray-700/50 text-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all"');

// Replace all textareas
code = code.replace(/<textarea\s+([^>]*?)className="[^"]*"/g, '<textarea $1className="w-full bg-gray-900/50 border border-gray-700/50 text-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all"');

// Replace all selects
code = code.replace(/<select\s+([^>]*?)className="[^"]*"/g, '<select $1className="w-full bg-gray-900/50 border border-gray-700/50 text-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all"');

fs.writeFileSync(FILE_PATH, code, 'utf8');
console.log('Modified forms successfully.');
