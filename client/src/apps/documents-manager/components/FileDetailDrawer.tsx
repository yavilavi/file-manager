import {Badge, Box, Button, Divider, Drawer, Group, Stack, Text} from '@mantine/core';
import {
    IconBuilding,
    IconCalendar,
    IconDownload, IconEdit,
    IconMapPin,
    IconTrash,
    IconUser,
    IconXboxX,
} from '@tabler/icons-react';
import formatFileSize from '../../../utils/format-file-size.util.ts';
import {format} from 'date-fns';
import useFileManagerStore from '../../../stores/file-manager.store.ts';
import {fetchFileById} from '../../../services/api/fetchFileById.ts';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useDownloadFile} from '../../../hooks/useDownloadFile.ts';
import {useDeleteDocument} from '../../../hooks/useDeleteDocument.ts';
import {useEditDocument} from '../../../hooks/useEditDocument.ts';
import { isOnlyOfficeEditable } from '../../../utils/is-onlyoffice-editable.ts';

const FileDetailDrawer = () => {
    const {selectedFile, setSelectedFile} = useFileManagerStore();
    const queryClient = useQueryClient();

    const {data: file} = useQuery({
        queryKey: ['file', selectedFile?.id],
        queryFn: () => fetchFileById(selectedFile!.id),
        enabled: !!selectedFile,
    });

    const download = useDownloadFile();
    const {editDocument} = useEditDocument();

    const deleteMutation = useDeleteDocument(() => {
        void queryClient.invalidateQueries({queryKey: ['files']});
    });

    return (
        <Drawer
            opened={!!selectedFile}
            onClose={() => setSelectedFile(null)}
            title={<Text size="1.6rem" fw={600}>Detalles del archivo</Text>}
            padding="lg"
            size="md"
            position="right"
            closeButtonProps={{
                icon: <IconXboxX size={20} stroke={1.5}/>,
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

                        <Divider/>

                        <Stack gap="xs">
                            <Group gap="xs">
                                <IconCalendar size={16}/>
                                <Text size="sm" fw={500}>
                                    Fecha de creación:
                                </Text>
                                <Text size="sm">{format(file.createdAt, 'dd/MM/yyyy HH:mm:ss')}</Text>
                            </Group>

                            <Group gap="xs">
                                <IconUser size={16}/>
                                <Text size="sm" fw={500}>
                                    Creado por:
                                </Text>
                                <Text size="sm">{file.user?.name}</Text>
                            </Group>

                            <Group gap="xs">
                                <IconMapPin size={16}/>
                                <Text size="sm" fw={500}>
                                    Departamento:
                                </Text>
                                <Text size="sm">{file.user?.department?.name ?? 'No especificado'}</Text>
                            </Group>

                            <Group gap="xs">
                                <IconBuilding size={16}/>
                                <Text size="sm" fw={500}>
                                    Nombre empresa
                                </Text>
                                <Text size="sm">{file.company?.name}</Text>
                            </Group>
                        </Stack>

                        <Divider/>

                        <Box>
                            <Text size="sm" c="dimmed" mb={4}>
                                Hash del archivo
                            </Text>
                            <Text size="xs" lineClamp={3} truncate="end" c="dimmed">
                                {file.hash}
                            </Text>
                        </Box>

                        <Divider/>
                        <Group justify="center" mt="md">
                            <Button
                                leftSection={<IconDownload size={16}/>}
                                variant="light"
                                color="green"
                                onClick={() => download.mutate(file.id)}
                                loading={download.isPending}
                            >
                                Descargar
                            </Button>
                            {isOnlyOfficeEditable(file.extension) && (
                                <Button
                                    leftSection={<IconEdit size={16}/>}
                                    variant="light"
                                    color="blue"
                                    onClick={() => editDocument(file.id)}
                                >
                                    Editar
                                </Button>
                            )}
                            <Button
                                leftSection={<IconTrash size={16}/>}
                                color="red"
                                variant="light"
                                onClick={() => {
                                    if (!selectedFile) return;
                                    deleteMutation.mutate(selectedFile.id);
                                    setSelectedFile(null);
                                }}
                                loading={deleteMutation.isPending}
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