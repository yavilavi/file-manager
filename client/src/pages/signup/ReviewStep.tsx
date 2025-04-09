import { Badge, Divider, List, Paper, Stack, Text, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

type ReviewStepProps = {
  form: UseFormReturnType<{
    companyName: string;
    nit: string;
    subdomain: string;
    departments: string[];
    adminName: string;
    adminEmail: string;
    adminPassword: string;
    confirmPassword: string;
  }>;
};

const ReviewStep = ({ form }: ReviewStepProps) => {
  return (
    <Paper withBorder p="md" radius="md" shadow="sm">
      <Title order={3} size="sm" mb="md">
        Revisa que la información sea correcta antes de enviar
      </Title>
      <Divider my="sm" />
      <Stack gap="sm">
        <Title order={4}>Empresa</Title>
        <Text>
          <strong>Nombre:</strong> {form.values.companyName}
        </Text>
        <Text>
          <strong>NIT:</strong> {form.values.nit}
        </Text>
        <Text>
          <strong>Subdominio:</strong>{' '}
        </Text>
        <Badge color="green" variant="light" tt="none">
          {window.location.protocol}//{form.values.subdomain}.{import.meta.env.VITE_APP_BASE_URL}
        </Badge>

        <Text>
          <strong>Departamentos:</strong>
        </Text>
        <List spacing="xs" size="sm" withPadding>
          {form.values.departments.map((dep: string) => (
            <List.Item key={dep}>{dep}</List.Item>
          ))}
        </List>

        <Divider my="sm" />

        <Title order={4}>Administrador</Title>
        <Text>
          <strong>Nombre:</strong> {form.values.adminName}
        </Text>
        <Text>
          <strong>Email:</strong> {form.values.adminEmail}
        </Text>
      </Stack>
    </Paper>
  );
};

export default ReviewStep;
