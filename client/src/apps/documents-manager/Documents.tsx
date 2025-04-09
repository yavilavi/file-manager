import { useQuery, useMutation } from '@tanstack/react-query';
import { Button, FileInput, Group, Table } from '@mantine/core';
import { fetchDocuments } from '../../services/api/fetchDocuments.ts';
import { uploadDocument } from '../../services/api/uploadDocument.ts';
import { notifications } from '@mantine/notifications';
import useFileManagerStore from '../../stores/file-manager.store.ts';
import { useState } from 'react';
import formatFileSize from '../../utils/format-file-size.util.ts';
import { format } from 'date-fns';
import FileDetailDrawer from './components/FileDetailDrawer.tsx';

export default function Documents() {
  const [file, setFile] = useState<File | null>(null);
  const { data, refetch } = useQuery({
    queryKey: ['files'],
    initialData: [],
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
              <Table.Th key="1">Tamaño</Table.Th>
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
