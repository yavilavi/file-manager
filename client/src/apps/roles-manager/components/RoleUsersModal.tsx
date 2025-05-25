/**
 * File Manager - Roleusersmodal
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { useState } from 'react';
import { Modal, Title, Text, Group, Button, Stack, ScrollArea, TextInput, ActionIcon, Tooltip, Table, Select } from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { IconUserPlus, IconUserMinus } from '@tabler/icons-react';
import { RoleInterface } from '../../../types/interfaces/role-interface';
import { UserInterface } from '../../../types/interfaces/user-interface';
import { assignRoleToUser } from '../../../services/api/assignRoleToUser';
import { removeRoleFromUser } from '../../../services/api/removeRoleFromUser';
import apiCall from '../../../services/axios';

interface RoleUsersModalProps {
  role: RoleInterface;
  onClose: () => void;
  onUpdate: () => void;
}

export default function RoleUsersModal({
  role,
  onClose,
  onUpdate
}: RoleUsersModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Fetch users with this role
  const { data: usersWithRole = [], refetch: refetchUsers } = useQuery({
    queryKey: ['roleUsers', role.id],
    queryFn: async () => {
      const { data } = await apiCall.get<UserInterface[]>(`/roles/${role.id}/users`);
      return data;
    }
  });

  // Fetch all users for dropdown
  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const { data } = await apiCall.get<UserInterface[]>('/users');
      return data;
    }
  });

  // Filter out users who already have the role
  const availableUsers = allUsers.filter(
    user => !usersWithRole.some(u => u.id === user.id)
  );

  // Assign user to role mutation
  const assignRoleMutation = useMutation({
    mutationFn: (userId: number) => assignRoleToUser(userId, role.id),
    onSuccess: () => {
      notifications.show({
        title: 'Usuario asignado',
        message: 'El usuario ha sido asignado al rol correctamente',
        color: 'green',
      });
      refetchUsers();
      setSelectedUserId(null);
      onUpdate();
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error al asignar usuario',
        message: error.response?.data?.message || 'OcurriÃ³ un error',
        color: 'red',
      });
    },
  });

  // Remove user from role mutation
  const removeRoleMutation = useMutation({
    mutationFn: (userId: number) => removeRoleFromUser(userId, role.id),
    onSuccess: () => {
      notifications.show({
        title: 'Usuario removido',
        message: 'El usuario ha sido removido del rol correctamente',
        color: 'green',
      });
      refetchUsers();
      onUpdate();
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error al remover usuario',
        message: error.response?.data?.message || 'OcurriÃ³ un error',
        color: 'red',
      });
    },
  });

  const handleAssignRole = () => {
    if (selectedUserId) {
      assignRoleMutation.mutate(Number(selectedUserId));
    }
  };

  const handleRemoveRole = (userId: number) => {
    if (window.confirm('Â¿EstÃ¡s seguro de eliminar este usuario del rol?')) {
      removeRoleMutation.mutate(userId);
    }
  };

  // Filter users based on search query
  const filteredUsers = usersWithRole.filter(user => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={<Title order={4}>Usuarios con el rol: {role.name}</Title>}
      centered
      size="lg"
      overlayProps={{ opacity: 0.55, blur: 3 }}
    >
      <Stack>
        <Group>
          <TextInput
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          
          <Group gap="xs">
            <Select
              placeholder="Seleccionar usuario"
              value={selectedUserId}
              onChange={setSelectedUserId}
              data={availableUsers.map(user => ({
                value: user.id.toString(),
                label: `${user.name} (${user.email})`
              }))}
              searchable
              clearable
              style={{ minWidth: 250 }}
              disabled={availableUsers.length === 0}
            />
            
            <Button
              leftSection={<IconUserPlus size={16} />}
              onClick={handleAssignRole}
              disabled={!selectedUserId}
              loading={assignRoleMutation.isPending}
            >
              Asignar
            </Button>
          </Group>
        </Group>
        
        <ScrollArea h={400}>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Departamento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.department?.name || '-'}</td>
                  <td>
                    <Tooltip label="Remover del rol">
                      <ActionIcon 
                        color="red"
                        onClick={() => handleRemoveRole(user.id)}
                        loading={removeRoleMutation.isPending && removeRoleMutation.variables === user.id}
                      >
                        <IconUserMinus size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <Text c="dimmed" ta="center">
                      {searchQuery 
                        ? 'No se encontraron usuarios con la bÃºsqueda actual' 
                        : 'No hay usuarios asignados a este rol'}
                    </Text>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </Modal>
  );
} 