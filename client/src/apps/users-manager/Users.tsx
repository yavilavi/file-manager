import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Button,
  Group,
  Table,
  Text,
  Modal,
  TextInput,
  PasswordInput,
  Select,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { fetchUsers } from '../../services/api/fetchUsers.ts';
import { createUser } from '../../services/api/createUser.ts';
import { format } from 'date-fns';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { fetchDepartments } from '../../services/api/fetchDepartments.ts';
import { AxiosError } from 'axios';

export default function Users() {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      departmentId: '',
    },

    validate: {
      name: (value) => (value.length < 2 ? 'Nombre muy corto' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      password: (value) => (value.length < 6 ? 'Contraseña muy corta' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Las contraseñas no coinciden' : null,
      departmentId: (value) => (!value ? 'Selecciona un departamento' : null),
    },
  });

  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ['users'],
    initialData: [],
    queryFn: fetchUsers,
  });

  const { data: departments } = useQuery({
    initialData: [],
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      notifications.show({
        id: 'user-creation-notification',
        title: 'Usuario creado',
        message: 'El usuario se creó correctamente',
        color: 'green',
        autoClose: 5000,
      });
      refetch();
      form.reset();
      close();
    },
    onError: (data) => {
      const error = data as AxiosError<{
        message: string;
        error: string;
        statusCode: number;
      }>;
      notifications.show({
        id: 'user-creation-notification',
        title: 'Error al crear usuario',
        message: `${error.response?.data.message ?? data.message}`,
        color: 'red',
        autoClose: 5000,
      });
    },
  });

  return (
    <>
      <h3>Documents</h3>
      <Group mb="md" align="center">
        <Button onClick={open}>Crear usuario</Button>
      </Group>

      <Modal
        opened={opened}
        onClose={close}
        title="Crear nuevo usuario"
        centered
      >
        <form
          onSubmit={form.onSubmit((values) =>
            createUserMutation.mutate({ ...values, departmentId: 2 }),
          )}
        >
          <TextInput
            label="Nombre"
            placeholder="Yilmer"
            {...form.getInputProps('name')}
            required
          />
          <TextInput
            label="Email"
            placeholder="yilmer@correo.com"
            {...form.getInputProps('email')}
            required
            mt="md"
          />
          <PasswordInput
            label="Contraseña"
            placeholder="********"
            {...form.getInputProps('password')}
            required
            mt="md"
          />
          <PasswordInput
            label="Confirmar contraseña"
            placeholder="********"
            {...form.getInputProps('confirmPassword')}
            required
            mt="md"
          />
          <Select
            label="Departamento"
            placeholder="Selecciona uno"
            data={departments.map((d) => ({
              value: d.id.toString(),
              label: d.name,
            }))}
            {...form.getInputProps('departmentId')}
            required
            mt="md"
          />

          <Group mt="lg">
            <Button type="submit" loading={createUserMutation.isPending}>
              Crear usuario
            </Button>
          </Group>
        </form>
      </Modal>

      {(isLoading || isFetching) && <Text>Loading...</Text>}
      {error && <Text>Error: {JSON.stringify(error)}</Text>}
      {data && data.length > 0 && (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr key="trh_0">
              <Table.Th key="0">Nombre</Table.Th>
              <Table.Th key="1">email</Table.Th>
              <Table.Th key="2">Departamento</Table.Th>
              <Table.Th key="3">Empresa</Table.Th>
              <Table.Th key="4">Estado</Table.Th>
              <Table.Th key="5">Fecha creación</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((element) => (
              <Table.Tr key={element.id}>
                <Table.Td key={`cell_${element.id}_name`}>
                  {element.name}
                </Table.Td>
                <Table.Td key={`cell_${element.id}_email`}>
                  {element.email}
                </Table.Td>
                <Table.Td key={`cell_${element.id}_department`}>
                  {element.department.name}
                </Table.Td>
                <Table.Td key={`cell_${element.id}_company`}>
                  {element.company.name}
                </Table.Td>
                <Table.Td key={`cell_${element.id}_Status`}>
                  {element.isActive ? 'Activo' : 'Inactivo'}
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
