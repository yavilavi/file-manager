const wordExtensions = [
  'doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'epub', 'fb2', 'fodt',
  'htm', 'html', 'hwp', 'hwpx', 'mht', 'mhtml', 'odt', 'ott', 'pages',
  'rtf', 'stw', 'sxw', 'txt', 'wps', 'wpt', 'xml'
];

const cellExtensions = [
  'csv', 'et', 'ett', 'fods', 'numbers', 'ods', 'ots', 'sxc',
  'xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx', 'xml'
];

const slideExtensions = [
  'dps', 'dpt', 'fodp', 'key', 'odp', 'otp', 'pot', 'potm',
  'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'sxi'
];

const pdfExtensions = ['djvu', 'docxf', 'oform', 'oxps', 'pdf', 'xps'];

/**
 * Checks if a file extension is supported by OnlyOffice for editing
 * Based on the OnlyOffice supported formats from the API
 */
export function isOnlyOfficeEditable(extension: string): boolean {
  // Convert extension to lowercase and remove dot if present
  const ext = extension.toLowerCase().replace(/^\./, '');
  
  // List of extensions that OnlyOffice supports for editing
  // Based on the API's onlyoffice-docs-formats.json and document-type.util.ts
  const editableExtensions = [...cellExtensions, ...pdfExtensions, ...slideExtensions, ...wordExtensions];
  
  return editableExtensions.includes(ext);
}