import { useMutation } from '@tanstack/react-query';
import { downloadFile } from '../services/api/downloadFile.ts';

export const useDownloadFile = () => {
  return useMutation({
    mutationFn: downloadFile,
  });
};
