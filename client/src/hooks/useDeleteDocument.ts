import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { deleteDocument } from '../services/api/deleteDocument.ts';

export function useDeleteDocument(onSuccess?: () => void) {
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      notifications.show({
        title: 'Documento eliminado',
        message: 'Se eliminó correctamente',
        color: 'green',
        autoClose: 5000,
      });
      onSuccess?.();
    },
    onError: (error) => {
      notifications.show({
        title: 'Error al eliminar el documento',
        message: error instanceof Error ? error.message : 'Error desconocido',
        color: 'red',
        autoClose: 5000,
      });
    },
  });
}
