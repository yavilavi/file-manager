export default function getDocumentTypeByExtension(extension: string): string {
  const wordExtensions = [
    'doc',
    'docm',
    'docx',
    'dot',
    'dotm',
    'dotx',
    'epub',
    'fb2',
    'fodt',
    'htm',
    'html',
    'hwp',
    'hwpx',
    'mht',
    'mhtml',
    'odt',
    'ott',
    'pages',
    'rtf',
    'stw',
    'sxw',
    'txt',
    'wps',
    'wpt',
    'xml',
  ];
  const cellExtensions = [
    'csv',
    'et',
    'ett',
    'fods',
    'numbers',
    'ods',
    'ots',
    'sxc',
    'xls',
    'xlsb',
    'xlsm',
    'xlsx',
    'xlt',
    'xltm',
    'xltx',
  ];
  const slideExtensions = [
    'dps',
    'dpt',
    'fodp',
    'key',
    'odp',
    'otp',
    'pot',
    'potm',
    'potx',
    'pps',
    'ppsm',
    'ppsx',
    'ppt',
    'pptm',
    'pptx',
    'sxi',
  ];
  const pdfExtensions = ['djvu', 'docxf', 'oform', 'oxps', 'pdf', 'xps'];

  const ext = extension.toLowerCase();

  if (wordExtensions.includes(ext)) {
    return 'word';
  } else if (cellExtensions.includes(ext)) {
    return 'cell';
  } else if (slideExtensions.includes(ext)) {
    return 'slide';
  } else if (pdfExtensions.includes(ext)) {
    return 'pdf';
  }

  // Default to 'cell' if extension is not recognized
  return 'cell';
}
