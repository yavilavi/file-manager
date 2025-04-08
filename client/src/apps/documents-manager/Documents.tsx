import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Box,
  Button,
  SimpleGrid,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { fetchDocuments } from '../../services/api/fetchDocuments.ts';
import { getFileIcon } from '../../utils/get-file-icon.tsx';
import classes from './Documents.module.css';
import formatFileSize from '../../utils/format-file-size.util.ts';
import { uploadDocument } from '../../services/api/uploadDocument.ts';
import { notifications } from '@mantine/notifications';
import useFileManagerStore from '../../stores/file-manager.store.ts';
import { useState } from 'react';

export default function Documents() {
  const [file, setFile] = useState<File | null>(null);
  const theme = useMantineTheme();
  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ['files'],
    queryFn: fetchDocuments,
  });

  const { setSelectedFile } = useFileManagerStore();

  const uploadFileMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      if (data.message === 'EXISTING') {
        notifications.update({
          id: 'default-notification',
          title: 'Operación fallida',
          message: `El archivo ya existe`,
          loading: false,
          autoClose: 10000,
          color: 'red',
        });
        setSelectedFile(data.file);
        return;
      }
      notifications.update({
        id: 'default-notification',
        title: 'Operación exitosa',
        message: `El archivo se ha cargado exitosamente`,
        loading: false,
        autoClose: 10000,
        color: 'green',
      });
      setSelectedFile(data.file);
      refetch();
    },
    onError: (data) => {
      notifications.update({
        id: 'default-notification',
        title: 'Operación fallida',
        message: `${data.message}`,
        loading: false,
        autoClose: 10000,
        color: 'red',
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]); // 📌 Guarda solo el archivo
    }
  };

  const handleUpload = () => {
    if (!file) {
      notifications.show({
        title: 'Error',
        message: 'Debe seleccionar un archivo',
        color: 'red',
      });
      return;
    }
    console.log('Archivo seleccionado:', file); // 🔍 Verifica el tipo
    console.log('Tipo de archivo:', file instanceof File); // 🔍 Debe ser true
    notifications.show({
      id: 'default-notification',
      title: 'Carga de archivo',
      message: 'El archivo está siendo cargado',
      loading: true,
      autoClose: false,
    });
    uploadFileMutation.mutate(file);
  };

  const files = (data ?? []).map((file) => (
    <Box
      key={file.id}
      className={classes.item}
      onClick={() => setSelectedFile(file)}
    >
      {getFileIcon(file.extension, 50, theme.colors['blue'][6])}
      <Text size="xs" maw={50} lineClamp={2}>
        {file.name}
      </Text>
      <Text size="xs" truncate="end" w={100} mt={7}>
        {file.size && formatFileSize(file.size)}
      </Text>
    </Box>
  ));

  return (
    <>
      <h3>Documents</h3>
      {/*<FileInput*/}
      {/*  clearable*/}
      {/*  label="Seleccionar archivo"*/}
      {/*  placeholder="Seleccionar archivo"*/}
      {/*  onChange={setFile}*/}
      {/*/>*/}
      <input type="file" onChange={handleFileChange} />
      <Button
        onClick={handleUpload}
        mt="md"
        disabled={uploadFileMutation.isPending}
      >
        {uploadFileMutation.isPending ? 'Cargando...' : 'Cargar'}
      </Button>
      {(isLoading || isFetching) && <Text>Loading...</Text>}
      {error && <Text>Error: {JSON.stringify(error)}</Text>}
      {data && data.length > 0 && (
        <SimpleGrid cols={10} mt="md">
          {files}
        </SimpleGrid>
      )}
    </>
  );
}
