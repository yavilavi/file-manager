/**
 * File Manager - Departments
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button, Group, Table, Modal, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { fetchDepartments } from '../../services/api/fetchDepartments.ts';
import { AxiosError } from 'axios';
import { createDepartment } from '../../services/api/createDepartment.ts';
import { format } from 'date-fns';
import { useState } from 'react';
import { DepartmentInterface } from '../../types/interfaces/user-interface.ts';
import { updateDepartment } from '../../services/api/updateDepartment.ts';

export default function Departments() {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentInterface | null>(null);

  const form = useForm({
    initialValues: { name: '' },
    validate: {
      name: (value) => (value.length < 2 ? 'Nombre muy corto' : null),
    },
  });

  const { data, refetch } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    initialData: [],
  });

  const createDepartmentMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      notifications.show({
        title: 'Departamento creado',
        message: 'Se creÃ³ correctamente',
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

  const updateDepartmentMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      notifications.show({
        title: 'Departamento actualizado',
        message: 'Se actualizÃ³ correctamente',
        color: 'green',
        autoClose: 5000,
      });
      refetch();
      form.reset();
      close();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notifications.show({
        title: 'Error al editar el departamento',
        message: `${error.response?.data.message ?? error.message}`,
        color: 'red',
        autoClose: 5000,
      });
    },
  });

  const handleEdit = (dept: DepartmentInterface) => {
    setSelectedDepartment(dept);
    form.setValues({ name: dept.name });
    open();
  };

  const handleSubmit = (values: { name: string }) => {
    if (selectedDepartment) {
      updateDepartmentMutation.mutate({
        id: selectedDepartment.id,
        ...values,
      });
    } else {
      createDepartmentMutation.mutate(values);
    }
  };

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
          setSelectedDepartment(null);
          close();
        }}
        title={selectedDepartment ? 'Editar departamento' : 'Crear departamento'}
        centered
      >
        <form
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <TextInput
            label="Nombre"
            placeholder="Recursos Humanos"
            {...form.getInputProps('name')}
            required
          />

          <Group mt="lg">
            <Button type="submit" loading={createDepartmentMutation.isPending}>
              {selectedDepartment ? 'Actualizar' : 'Crear'}
            </Button>
          </Group>
        </form>
      </Modal>

      {data.length > 0 && (
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Fecha de creaciÃ³n</Table.Th>
              <Table.Th key="6">Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((dept) => (
              <Table.Tr key={dept.id}>
                <Table.Td>{dept.name}</Table.Td>
                <Table.Td>
                  {format(new Date(dept.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                </Table.Td>

                <Table.Td key={`cell_${dept.id}_actions`}>
                  <Group gap="xs">
                    <Button
                      variant="light"
                      size="xs"
                      onClick={() => handleEdit(dept)}
                    >
                      Editar
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  );
}
