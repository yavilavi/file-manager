import { useQuery, useMutation } from '@tanstack/react-query';
import { Button, Group, Table, Text, Modal, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { fetchDepartments } from '../../services/api/fetchDepartments.ts';
import { AxiosError } from 'axios';
import { createDepartment } from '../../services/api/createDepartment.ts';
import { format } from 'date-fns';

export default function Departments() {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: { name: '' },
    validate: {
      name: (value) => (value.length < 2 ? 'Nombre muy corto' : null),
    },
  });

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    initialData: [],
  });

  const createDepartmentMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      notifications.show({
        title: 'Departamento creado',
        message: 'Se creó correctamente',
        color: 'green',
        autoClose: 5000,
      });
      refetch();
      form.reset();
      close();
    },
    onError: (
      error: AxiosError<{
        message: string;
        error: string;
        statusCode: number;
      }>,
    ) => {
      notifications.show({
        title: 'Error al crear el departamento',
        message: `${error.response?.data.message ?? error.message}`,
        color: 'red',
        autoClose: 5000,
      });
    },
  });

  return (
    <>
      <h3>Departamentos</h3>
      <Group mb="md">
        <Button onClick={open}>Crear departamento</Button>
      </Group>

      <Modal
        opened={opened}
        onClose={() => {
          form.reset();
          close();
        }}
        title="Crear nuevo departamento"
        centered
      >
        <form
          onSubmit={form.onSubmit((values) =>
            createDepartmentMutation.mutate(values),
          )}
        >
          <TextInput
            label="Nombre"
            placeholder="Recursos Humanos"
            {...form.getInputProps('name')}
            required
          />

          <Group mt="lg">
            <Button type="submit" loading={createDepartmentMutation.isPending}>
              Crear
            </Button>
          </Group>
        </form>
      </Modal>

      {(isLoading || isFetching) && <Text>Loading...</Text>}
      {error && <Text>Error: {JSON.stringify(error)}</Text>}

      {data.length > 0 && (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Fecha de creación</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((dept) => (
              <Table.Tr key={dept.id}>
                <Table.Td>{dept.name}</Table.Td>
                <Table.Td>
                  {format(new Date(dept.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  );
}
