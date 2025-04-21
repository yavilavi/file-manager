export function useEditDocument() {
  const editDocument = (fileId: number) => {
    window.open(`/documents/${fileId}/edit`, '_blank');
  };

  return {
    editDocument,
  };
} 