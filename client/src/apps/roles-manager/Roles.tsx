/**
 * File Manager - Roles
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
  Checkbox,
  Stack,
  ActionIcon,
  Text,
  Badge,
  ScrollArea,
  MultiSelect,
  Box,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { format } from 'date-fns';
import { RoleInterface, UpdateRoleDto } from '../../types/interfaces/role-interface';
import { fetchRoles } from '../../services/api/fetchRoles';
import { createRole } from '../../services/api/createRole';
import { updateRole } from '../../services/api/updateRole';
import { deleteRole } from '../../services/api/deleteRole';
import { fetchPermissions } from '../../services/api/fetchPermissions';
import { IconEdit, IconTrash, IconShield, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import RolePermissionsModal from './components/RolePermissionsModal';
import RoleUsersModal from './components/RoleUsersModal';

interface FormValues {
  name: string;
  description: string;
  isAdmin: boolean;
  permissionIds: string[];
}

export default function Roles() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingRole, setEditingRole] = useState<RoleInterface | null>(null);
  const [permissionsModalRole, setPermissionsModalRole] = useState<RoleInterface | null>(null);
  const [usersModalRole, setUsersModalRole] = useState<RoleInterface | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      description: '',
      isAdmin: false,
      permissionIds: [],
    },

    validate: {
      name: (value) => (value.length < 2 ? 'Nombre muy corto' : null),
    },
  });

  // Fetch roles
  const { data: roles = [], refetch } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
  });

  // Fetch permissions for dropdown
  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: fetchPermissions,
  });

  // Permission options for multiselect
  const permissionOptions = permissions.map((permission) => ({
    value: permission.id,
    label: `${permission.description} (${permission.id})`,
  }));

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      notifications.show({
        title: 'Rol creado',
        message: 'El rol se creÃ³ correctamente',
        color: 'green',
      });
      refetch();
      form.reset();
      close();
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error al crear rol',
        message: error.response?.data?.message || 'OcurriÃ³ un error',
        color: 'red',
      });
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: (data: { id: number; role: UpdateRoleDto }) => updateRole(data.id, data.role),
    onSuccess: () => {
      notifications.show({
        title: 'Rol actualizado',
        message: 'El rol se actualizÃ³ correctamente',
        color: 'green',
      });
      refetch();
      form.reset();
      close();
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error al actualizar rol',
        message: error.response?.data?.message || 'OcurriÃ³ un error',
        color: 'red',
      });
    },
  });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      notifications.show({
        title: 'Rol eliminado',
        message: 'El rol se eliminÃ³ correctamente',
        color: 'green',
      });
      refetch();
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error al eliminar rol',
        message: error.response?.data?.message || 'OcurriÃ³ un error',
        color: 'red',
      });
    },
  });

  const handleSubmit = (values: FormValues) => {
    const { name, description, isAdmin, permissionIds } = values;
    
    if (editingRole) {
      // Update role
      updateRoleMutation.mutate({
        id: editingRole.id,
        role: {
          name,
          description: description || undefined,
          isAdmin,
          permissionIds: permissionIds.length > 0 ? permissionIds : undefined,
        },
      });
    } else {
      // Create role
      createRoleMutation.mutate({
        name,
        description: description || undefined,
        isAdmin,
        permissionIds: permissionIds.length > 0 ? permissionIds : undefined,
      });
    }
  };

  const handleDeleteRole = (role: RoleInterface) => {
    if (window.confirm(`Â¿EstÃ¡s seguro de eliminar el rol "${role.name}"?`)) {
      deleteRoleMutation.mutate(role.id);
    }
  };

  const handleEditRole = (role: RoleInterface) => {
    setEditingRole(role);
    form.setValues({
      name: role.name,
      description: role.description || '',
      isAdmin: role.isAdmin,
      permissionIds: role.permissions.map(p => p.id),
    });
    open();
  };

  const handleCloseForm = () => {
    setEditingRole(null);
    form.reset();
    close();
  };

  const handleOpenPermissions = (role: RoleInterface) => {
    setPermissionsModalRole(role);
  };

  const handleOpenUsers = (role: RoleInterface) => {
    setUsersModalRole(role);
  };

  return (
    <>
      <h3>Roles y Permisos</h3>
      <Group mb="md" justify="apart">
        <Button onClick={open}>Crear rol</Button>
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>DescripciÃ³n</th>
              <th>Permisos</th>
              <th>Usuarios</th>
              <th>Admin</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>{role.description || '-'}</td>
                <td>
                  <Group gap="xs">
                    <Badge>{role.permissions.length}</Badge>
                    <Tooltip label="Ver/editar permisos">
                      <ActionIcon color="blue" onClick={() => handleOpenPermissions(role)}>
                        <IconShield size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </td>
                <td>
                  <Group gap="xs">
                    <Badge>{role.userCount || 0}</Badge>
                    <Tooltip label="Ver usuarios">
                      <ActionIcon color="blue" onClick={() => handleOpenUsers(role)}>
                        <IconUser size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </td>
                <td>{role.isAdmin ? 'SÃ­' : 'No'}</td>
                <td>{format(new Date(role.createdAt), 'dd/MM/yyyy')}</td>
                <td>
                  <Group gap="xs">
                    <Tooltip label="Editar rol">
                      <ActionIcon color="blue" onClick={() => handleEditRole(role)}>
                        <IconEdit size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Eliminar rol">
                      <ActionIcon color="red" onClick={() => handleDeleteRole(role)}>
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </td>
              </tr>
            ))}
            {roles.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <Text ta="center" color="dimmed">
                    No hay roles definidos
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>

      {/* Create/Edit Role Modal */}
      <Modal
        opened={opened}
        onClose={handleCloseForm}
        title={editingRole ? 'Editar rol' : 'Crear nuevo rol'}
        centered
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Nombre"
              placeholder="Administrador, Editor, etc."
              withAsterisk
              {...form.getInputProps('name')}
            />
            
            <Textarea
              label="DescripciÃ³n"
              placeholder="DescripciÃ³n del rol y sus funciones"
              {...form.getInputProps('description')}
            />
            
            <Checkbox
              label="Rol de administrador (todos los permisos)"
              {...form.getInputProps('isAdmin', { type: 'checkbox' })}
            />
            
            <Box>
              <Text size="sm" fw={500} mb={5}>
                Permisos
              </Text>
              <MultiSelect
                data={permissionOptions}
                placeholder="Seleccionar permisos"
                searchable
                clearable
                disabled={form.values.isAdmin}
                {...form.getInputProps('permissionIds')}
              />
              {form.values.isAdmin && (
                <Text size="xs" color="dimmed" mt={5}>
                  Los administradores tienen todos los permisos automÃ¡ticamente
                </Text>
              )}
            </Box>
            
            <Group justify="right" mt="md">
              <Button variant="outline" onClick={handleCloseForm}>
                Cancelar
              </Button>
              <Button type="submit" loading={createRoleMutation.isPending || updateRoleMutation.isPending}>
                {editingRole ? 'Actualizar' : 'Crear'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Role Permissions Modal */}
      {permissionsModalRole && (
        <RolePermissionsModal
          role={permissionsModalRole}
          permissions={permissions}
          onClose={() => setPermissionsModalRole(null)}
          onUpdate={refetch}
        />
      )}

      {/* Role Users Modal */}
      {usersModalRole && (
        <RoleUsersModal
          role={usersModalRole}
          onClose={() => setUsersModalRole(null)}
          onUpdate={refetch}
        />
      )}
    </>
  );
} 