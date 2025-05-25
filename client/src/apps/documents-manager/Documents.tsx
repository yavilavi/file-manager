/**
 * File Manager - Documents
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button, FileInput, Group, Progress, Table } from '@mantine/core';
import { fetchDocuments } from '../../services/api/fetchDocuments.ts';
import { uploadDocument } from '../../services/api/uploadDocument.ts';
import { notifications } from '@mantine/notifications';
import useFileManagerStore from '../../stores/file-manager.store.ts';
import { useEffect, useState } from 'react';
import formatFileSize from '../../utils/format-file-size.util.ts';
import { format } from 'date-fns';
import FileDetailDrawer from './components/FileDetailDrawer.tsx';
import { IconError404 } from '@tabler/icons-react';

export default function Documents() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { data, refetch } = useQuery({
    queryKey: ['files'],
    initialData: [],
    queryFn: fetchDocuments,
  });
  useEffect(() => {
    if (uploadProgress !== 0) {
      notifications.update({
        id: 'default-notification',
        title: 'Cargando archivo',
        message: (
          <Progress value={uploadProgress} transitionDuration={1000}/>
        ),
        loading: true,
        autoClose: false,
      });
    }
  }, [uploadProgress]);
  const { setSelectedFile } = useFileManagerStore();

  const uploadWithProgress = (file: File) => {
    setUploadProgress(0);
    return uploadDocument(file, (progress) => {
      setUploadProgress(progress);
    });
  };
  const uploadFileMutation = useMutation({
    mutationFn: uploadWithProgress,
    onSuccess: (data) => {
      if (data.message === 'EXISTING') {
        notifications.update({
          id: 'default-notification',
          title: 'OperaciÃ³n fallida',
          message: `El archivo ya existe`,
          loading: false,
          autoClose: 3000,
          color: 'red',
        });
        setSelectedFile(data.file);
        setUploadProgress(0);
        return;
      }
      notifications.update({
        id: 'default-notification',
        title: 'OperaciÃ³n exitosa',
        message: `El archivo se ha cargado exitosamente`,
        loading: false,
        autoClose: 3000,
        color: 'green',
      });
      setSelectedFile(data.file);
      setUploadProgress(0);
      refetch();
    },
    onError: (data) => {
      notifications.update({
        id: 'default-notification',
        title: 'OperaciÃ³n fallida',
        message: `${data.message}`,
        loading: false,
        autoClose: 3000,
        color: 'grape',
        icon: <IconError404 />,
      });
      setUploadProgress(0);
    },

  });

  const handleUpload = () => {
    if (!file) {
      notifications.show({
        title: 'Error',
        message: 'Debe seleccionar un archivo',
        color: 'red',
      });
      return;
    }
    setUploadProgress(1);
    notifications.show({
      id: 'default-notification',
      title: 'Cargando archivo',
      message: (
        <Progress value={uploadProgress} />
      ),
      loading: true,
      autoClose: false,
      withCloseButton: false,
    });
    uploadFileMutation.mutate(file);
  };

  return (
    <>
      <h3>Documents</h3>
      <Group mb="md" align="center">
        <FileInput
          clearable
          placeholder="Seleccionar archivo"
          onChange={setFile}
        />
        <Button onClick={handleUpload} disabled={uploadFileMutation.isPending}>
          {uploadFileMutation.isPending ? 'Cargando...' : 'Cargar'}
        </Button>
      </Group>
      <FileDetailDrawer />

      {data && data.length > 0 && (
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr key="trh_0">
              <Table.Th key="0">Nombre</Table.Th>
              <Table.Th key="1">TamaÃ±o</Table.Th>
              <Table.Th key="3">Creado por</Table.Th>
              <Table.Th key="4">Departamento</Table.Th>
              <Table.Th key="5">Empresa</Table.Th>
              <Table.Th key="6">Fecha creación</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((element) => (
              <Table.Tr
                key={element.id}
                onClick={() => {
                  setSelectedFile(element);
                }}
              >
                <Table.Td key={`cell_${element.id}_name`}>
                  {element.name}
                </Table.Td>
                <Table.Td key={`cell_${element.id}_size`}>
                  {formatFileSize(element.size)}
                </Table.Td>
                <Table.Td key={`cell_${element.id}_createdBy`}>
                  {element.user.name}
                </Table.Td>
                <Table.Td key={`cell_${element.id}_department`}>
                  {element.user?.department?.name ?? 'Sin departamento'}
                </Table.Td>
                <Table.Td key={`cell_${element.id}_company`}>
                  {element.company.name}
                </Table.Td>
                <Table.Td key={`cell_${element.id}_createdAt`}>
                  {format(new Date(element.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  );
}
