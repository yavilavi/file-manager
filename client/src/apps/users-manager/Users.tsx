/**
 * File Manager - Users
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Button,
  Group,
  Table,
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
import { useEffect, useState } from 'react';
import { UserInterface } from '../../types/interfaces/user-interface.ts';
import { updateUser } from '../../services/api/updateUser.ts';
import { toggleUserStatus } from '../../services/api/toggleUserStatus.ts';
import useAuthStore from '../../stores/auth.store.ts';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  departmentId: string;
}

export default function Users() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingUser, setEditingUser] = useState<UserInterface | null>(null);
  const { user } = useAuthStore();

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
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invÃ¡lido'),
      password: (value) => {
        if (!editingUser) return (value.length < 6 ? 'ContraseÃ±a muy corta' : null);
        if (editingUser && value.length > 0) return (value.length < 6 ? 'ContraseÃ±a muy corta' : null);
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.password && !editingUser ? 'Las contraseÃ±as no coinciden' : null,
      departmentId: (value) => (!value ? 'Selecciona un departamento' : null),
    },
  });

  const { data, refetch } = useQuery({
    queryKey: ['users'],
    initialData: [],
    queryFn: fetchUsers,
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser, // crea esta funciÃ³n en /services/api/updateUser.ts
    onSuccess: () => {
      notifications.show({
        title: 'Usuario actualizado',
        message: 'Cambios guardados correctamente',
        color: 'green',
      });
      refetch();
      close();
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'No se pudo actualizar el usuario',
        color: 'red',
      });
    },
  });


  const toggleStatusMutation = useMutation({
    mutationFn: toggleUserStatus, // crea en /services/api/toggleUserStatus.ts
    onSuccess: () => refetch(),
  });

  const handleSubmit = (values: FormValues) => {
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, ...values });
    } else {
      createUserMutation.mutate({
        ...values,
        confirmPassword: values.confirmPassword,
        departmentId: Number(values.departmentId),
      });
    }
  };

  useEffect(() => {
    if (editingUser) {
      console.log(editingUser.department?.id);
      form.setValues({
        name: editingUser.name,
        email: editingUser.email,
        password: '',
        confirmPassword: '',
        departmentId: editingUser.department?.id.toString(),
      });
      open();
    }
  }, [editingUser]);

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
        message: 'El usuario se creÃ³ correctamente',
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
        onClose={() => {
          close();
          setEditingUser(null);
          form.reset();
        }}
        title={editingUser ? 'Editar usuario' : 'Crear nuevo usuario'}
        centered
      >
        <form
          onSubmit={form.onSubmit(handleSubmit)}
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
            label={`ContraseÃ±a ${editingUser ? '(opcional)' : ''}`}
            placeholder="********"
            {...form.getInputProps('password')}
            required={!editingUser}
            mt="md"
          />
          {!editingUser && <PasswordInput
            label="Confirmar contraseÃ±a"
            placeholder="********"
            {...form.getInputProps('confirmPassword')}
            required={!editingUser}
            mt="md"
          />}
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
              {editingUser ? 'Actualizar' : 'Crear'}
            </Button>
          </Group>
        </form>
      </Modal>
      {data && data.length > 0 && (
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr key="trh_0">
              <Table.Th key="0">Nombre</Table.Th>
              <Table.Th key="1">email</Table.Th>
              <Table.Th key="2">Departamento</Table.Th>
              <Table.Th key="3">Empresa</Table.Th>
              <Table.Th key="4">Estado</Table.Th>
              <Table.Th key="5">Fecha creaciÃ³n</Table.Th>
              <Table.Th key="6">Acciones</Table.Th>
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
                  {element?.department?.name ?? 'Sin departamento'}
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
                <Table.Td key={`cell_${element.id}_actions`}>
                  <Group gap="xs">
                    <Button
                      variant="light"
                      size="xs"
                      onClick={() => setEditingUser(element)}
                    >
                      Editar
                    </Button>
                    {element.id !== user?.id && < Button
                      variant="outline"
                      size="xs"
                      color={element.isActive ? 'red' : 'green'}
                      onClick={() => toggleStatusMutation.mutate(element.id)}
                    >
                      {element.isActive ? 'Deshabilitar' : 'Habilitar'}
                    </Button>}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  )
    ;
}
