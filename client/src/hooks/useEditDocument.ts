/**
 * File Manager - Useeditdocument
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
export function useEditDocument() {
  const editDocument = (fileId: number) => {
    window.open(`/documents/${fileId}/edit`, '_blank');
  };

  return {
    editDocument,
  };
} 