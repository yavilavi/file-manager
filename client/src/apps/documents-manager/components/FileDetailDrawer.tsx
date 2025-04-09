import { Badge, Box, Button, Divider, Drawer, Group, Stack, Text, Title } from '@mantine/core';
import {
  IconBuilding,
  IconCalendar,
  IconDownload,
  IconMapPin,
  IconTrash,
  IconUser,
  IconXboxX,
} from '@tabler/icons-react';
import formatFileSize from '../../../utils/format-file-size.util.ts';
import { format } from 'date-fns';
import useFileManagerStore from '../../../stores/file-manager.store.ts';
import { fetchFileById } from '../../../services/api/fetchFileById.ts';
import { useQuery } from '@tanstack/react-query';
import { useDownloadFile } from '../../../hooks/useDownloadFile.ts';

const FileDetailDrawer = () => {
  const { selectedFile, setSelectedFile } = useFileManagerStore();

  const { data: file } = useQuery({
    queryKey: ['file', selectedFile?.id],
    queryFn: () => fetchFileById(selectedFile!.id),
    enabled: !!selectedFile,
  });


  const download = useDownloadFile();

  return (
    <Drawer
      opened={!!selectedFile}
      onClose={() => setSelectedFile(null)}
      title={<Title order={3}>Detalles del archivo</Title>}
      padding="lg"
      size="md"
      position="right"
      closeButtonProps={{
        icon: <IconXboxX size={20} stroke={1.5} />,
      }}
    >
      {file && (
        <Box mt="2rem">
          <Stack>
            <Group justify="center">
              <Text fw={500} size="lg">
                {file.name}
              </Text>
              <Badge color="blue" variant="light">
                {formatFileSize(file.size)}
              </Badge>
            </Group>

            <Divider />

            <Stack gap="xs">
              <Group gap="xs">
                <IconCalendar size={16} />
                <Text size="sm" fw={500}>
                  Fecha de creación:
                </Text>
                <Text size="sm">{format(file.createdAt, 'dd/MM/yyyy HH:mm:ss')}</Text>
              </Group>

              <Group gap="xs">
                <IconUser size={16} />
                <Text size="sm" fw={500}>
                  Creado por:
                </Text>
                <Text size="sm">{file.user?.name}</Text>
              </Group>

              <Group gap="xs">
                <IconMapPin size={16} />
                <Text size="sm" fw={500}>
                  Departamento:
                </Text>
                <Text size="sm">{file.user?.department?.name ?? 'No especificado'}</Text>
              </Group>

              <Group gap="xs">
                <IconBuilding size={16} />
                <Text size="sm" fw={500}>
                  Nombre empresa
                </Text>
                <Text size="sm">{file.company?.name}</Text>
              </Group>
            </Stack>

            <Divider />

            <Box>
              <Text size="sm" c="dimmed" mb={4}>
                Hash del archivo
              </Text>
              <Text size="xs" lineClamp={3} truncate="end" c="dimmed">
                {file.hash}
              </Text>
            </Box>

            <Divider />
            <Group justify="center" mt="md">
              <Button
                leftSection={<IconDownload size={16} />}
                variant="light"
                color="blue"
                onClick={() => download.mutate(file.id)}
                loading={download.isPending}
              >
                Descargar
              </Button>
              <Button
                leftSection={<IconTrash size={16} />}
                color="red"
                variant="light"
                onClick={() => {
                }}
              >
                Eliminar
              </Button>
            </Group>
          </Stack>
        </Box>
      )}
    </Drawer>
  );
};
export default FileDetailDrawer;