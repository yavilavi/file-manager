import { 
  Card, 
  Text, 
  Title, 
  Group, 
  Stack, 
  Badge, 
  Grid,
  Alert
} from '@mantine/core';
import { IconInfoCircle, IconBuilding } from '@tabler/icons-react';
import useAuthStore from '../../stores/auth.store';

export default function Company() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <Alert icon={<IconInfoCircle size="1rem" />} title="Error" color="red">
        No se pudo obtener la información del usuario
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      <Title order={2} mb="xs">Información de la Empresa</Title>

      {/* Company Data */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group gap="xs" mb="sm">
          <IconBuilding size="1.2rem" />
          <Title order={4}>Datos de la Empresa</Title>
        </Group>
        <Grid gutter="sm">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text size="xs" c="dimmed" mb={2}>Nombre</Text>
            <Text fw={500} size="sm">{user.company.name}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text size="xs" c="dimmed" mb={2}>NIT</Text>
            <Text fw={500} size="sm">{user.company.nit}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text size="xs" c="dimmed" mb={2}>Tenant ID</Text>
            <Text fw={500} size="sm">{user.company.tenantId}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text size="xs" c="dimmed" mb={2}>Estado de Email</Text>
            <Badge size="sm" color={user.canSendEmail ? 'green' : 'red'} variant="light">
              {user.canSendEmail ? 'Activo' : 'Inactivo'}
            </Badge>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Additional Company Information */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group gap="xs" mb="sm">
          <IconInfoCircle size="1.2rem" />
          <Title order={4}>Información Adicional</Title>
        </Group>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed" mb={2}>Tenant ID Completo</Text>
            <Text size="sm">{user.company.tenantId}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="sm" c="dimmed" mb={2}>Servicios Habilitados</Text>
            <Group gap="xs">
              <Badge size="sm" color="blue" variant="light">Documentos</Badge>
              {user.canSendEmail && <Badge size="sm" color="green" variant="light">Email</Badge>}
              <Badge size="sm" color="orange" variant="light">Usuarios</Badge>
            </Group>
          </Grid.Col>
        </Grid>
      </Card>
    </Stack>
  );
} 