export const markdownToHtml = (md: string) => {
    if (!md) return '';
    return md
        .replace(/\[color:(.*?)\](.*?)\[\/color\]/g, '<span style="color:$1">$2</span>')
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.*?)\*/g, '<i>$1</i>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/\n/g, '<br>');
};

export const htmlToMarkdown = (html: string) => {
    if (!html) return '';
    return html
        .replace(/<span style="color:(.*?)">(.*?)<\/span>/g, '[color:$1]$2[/color]')
        .replace(/<b>(.*?)<\/b>/g, '**$1**')
        .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
        .replace(/<i>(.*?)<\/i>/g, '*$1*')
        .replace(/<em>(.*?)<\/em>/g, '*$1*')
        .replace(/<u>(.*?)<\/u>/g, '__$1__')
        .replace(/<br>/g, '\n')
        .replace(/<div>/g, '\n')
        .replace(/<\/div>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/<[^>]*>/g, ''); // Strip remaining tags
};
