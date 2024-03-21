export const sanitizeHTML = (str: string) => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  const reg = /[&<>"'`=\/]/gi;
  return str.replace(reg, (match) => map[match] || match);
};
