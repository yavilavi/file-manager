/**
 * Checks if a file extension is supported by OnlyOffice for editing
 * Based on the OnlyOffice supported formats from the API
 */
export function isOnlyOfficeEditable(extension: string): boolean {
  // Convert extension to lowercase and remove dot if present
  const ext = extension.toLowerCase().replace(/^\./, '');
  
  // List of extensions that OnlyOffice supports for editing
  // Based on the API's onlyoffice-docs-formats.json and document-type.util.ts
  const editableExtensions = [
    // Word documents (docx, docm, dotm, dotx)
    'docx', 'docm', 'dotm', 'dotx',
    // Excel spreadsheets (xlsx, xlsm, xltm, xltx)
    'xlsx', 'xlsm', 'xltm', 'xltx',
    // PowerPoint presentations (pptx, pptm, potm, potx, ppsm, ppsx)
    'pptx', 'pptm', 'potm', 'potx', 'ppsm', 'ppsx',
    // PDF files
    'pdf'
  ];
  
  return editableExtensions.includes(ext);
}

/**
 * Gets the document type for a given file extension
 * Based on the API's document-type.util.ts implementation
 */
export function getDocumentTypeByExtension(extension: string): string {
  const ext = extension.toLowerCase().replace(/^\./, '');
  
  const wordExtensions = [
    'doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'epub', 'fb2', 'fodt',
    'htm', 'html', 'hwp', 'hwpx', 'mht', 'mhtml', 'odt', 'ott', 'pages',
    'rtf', 'stw', 'sxw', 'txt', 'wps', 'wpt', 'xml'
  ];
  
  const cellExtensions = [
    'csv', 'et', 'ett', 'fods', 'numbers', 'ods', 'ots', 'sxc',
    'xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx'
  ];
  
  const slideExtensions = [
    'dps', 'dpt', 'fodp', 'key', 'odp', 'otp', 'pot', 'potm',
    'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'sxi'
  ];
  
  const pdfExtensions = ['djvu', 'docxf', 'oform', 'oxps', 'pdf', 'xps'];

  if (wordExtensions.includes(ext)) {
    return 'word';
  } else if (cellExtensions.includes(ext)) {
    return 'cell';
  } else if (slideExtensions.includes(ext)) {
    return 'slide';
  } else if (pdfExtensions.includes(ext)) {
    return 'pdf';
  }

  return '';
} 