import { Note } from '../types';

/**
 * Downloads a file to the user's browser with the given filename and MIME type
 */
export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Sanitizes a title for use in filenames
 */
export function sanitizeFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 50) || 'papyrus-note';
}

/**
 * Exports a single note as Markdown (.md)
 */
export function exportNoteAsMarkdown(note: Note): void {
  const tagsHeader = note.tags && note.tags.length > 0 ? `\n**Tags:** ${note.tags.map(t => `#${t}`).join(' ')}\n` : '';
  const categoryHeader = `**Category:** ${note.category}\n`;
  const dateHeader = `**Created:** ${new Date(note.createdAt).toLocaleDateString()} | **Updated:** ${new Date(note.updatedAt).toLocaleDateString()}\n`;
  
  let checklistMarkdown = '';
  if (note.checklist && note.checklist.length > 0) {
    checklistMarkdown = '\n\n## Checklist\n' + note.checklist.map(c => `- [${c.completed ? 'x' : ' '}] ${c.text}`).join('\n');
  }

  const fullMarkdown = `# ${note.title}\n${categoryHeader}${dateHeader}${tagsHeader}\n---\n\n${note.content}${checklistMarkdown}\n`;
  
  downloadFile(`${sanitizeFilename(note.title)}.md`, fullMarkdown, 'text/markdown;charset=utf-8');
}

/**
 * Exports a single note as plain text (.txt)
 */
export function exportNoteAsPlainText(note: Note): void {
  const plain = `${note.title.toUpperCase()}\n` +
    `Category: ${note.category}\n` +
    `Date: ${new Date(note.updatedAt).toLocaleString()}\n` +
    `----------------------------------------\n\n` +
    `${note.content.replace(/[#*_`~]/g, '')}\n`;
    
  downloadFile(`${sanitizeFilename(note.title)}.txt`, plain, 'text/plain;charset=utf-8');
}

/**
 * Copies plain text or markdown to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      return true;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}
