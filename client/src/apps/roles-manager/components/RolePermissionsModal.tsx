/**
 * File Manager - Rolepermissionsmodal
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { useState, useMemo } from 'react';
import { Modal, Title, Text, Group, Button, Checkbox, Stack, ScrollArea, TextInput } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { RoleInterface, PermissionInterface, UpdateRoleDto } from '../../../types/interfaces/role-interface';
import { updateRole } from '../../../services/api/updateRole';

interface RolePermissionsModalProps {
  role: RoleInterface;
  permissions: PermissionInterface[];
  onClose: () => void;
  onUpdate: () => void;
}

export default function RolePermissionsModal({
  role,
  permissions,
  onClose,
  onUpdate
}: RolePermissionsModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role.permissions.map(p => p.id)
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: (data: { id: number; role: UpdateRoleDto }) => updateRole(data.id, data.role),
    onSuccess: () => {
      notifications.show({
        title: 'Permisos actualizados',
        message: 'Los permisos del rol se actualizaron correctamente',
        color: 'green',
      });
      onUpdate();
      onClose();
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error al actualizar permisos',
        message: error.response?.data?.message || 'OcurriÃ³ un error',
        color: 'red',
      });
    },
  });

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    updateRoleMutation.mutate({
      id: role.id,
      role: {
        permissionIds: selectedPermissions
      }
    });
  };

  const filteredPermissions = useMemo(() => {
    if (!searchQuery.trim()) return permissions;
    
    const query = searchQuery.toLowerCase();
    return permissions.filter(
      permission => 
        permission.id.toLowerCase().includes(query) || 
        permission.description.toLowerCase().includes(query)
    );
  }, [permissions, searchQuery]);

  // Group permissions by resource for better organization
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, PermissionInterface[]> = {};
    
    filteredPermissions.forEach(permission => {
      const resource = permission.id.split(':')[0];
      if (!groups[resource]) {
        groups[resource] = [];
      }
      groups[resource].push(permission);
    });
    
    return groups;
  }, [filteredPermissions]);

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={<Title order={4}>Permisos para el rol: {role.name}</Title>}
      centered
      size="lg"
      overlayProps={{ opacity: 0.55, blur: 3 }}
    >
      <Stack>
        {role.isAdmin ? (
          <Text c="dimmed">
            Este rol es de administrador y tiene todos los permisos automÃ¡ticamente.
          </Text>
        ) : (
          <>
            <TextInput
              placeholder="Buscar permisos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              mb="md"
            />
            
            <ScrollArea h={400} offsetScrollbars>
              <Stack gap="lg">
                {Object.entries(groupedPermissions).map(([resource, perms]) => (
                  <div key={resource}>
                    <Text fw={600} mb="xs" tt="uppercase">
                      {resource}
                    </Text>
                    
                    <Stack gap="xs">
                      {perms.map(permission => (
                        <Checkbox
                          key={permission.id}
                          label={
                            <Group gap="xs">
                              <Text>{permission.description}</Text>
                              <Text size="xs" c="dimmed">({permission.id})</Text>
                            </Group>
                          }
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                        />
                      ))}
                    </Stack>
                  </div>
                ))}

                {filteredPermissions.length === 0 && (
                  <Text c="dimmed" ta="center">
                    No se encontraron permisos con la bÃºsqueda actual
                  </Text>
                )}
              </Stack>
            </ScrollArea>
            
            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                loading={updateRoleMutation.isPending}
              >
                Guardar cambios
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
} 