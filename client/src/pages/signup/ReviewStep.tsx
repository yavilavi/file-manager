import { Badge, Divider, List, Paper, Stack, Text, Title } from '@mantine/core';

interface CompanyData {
  name: string;
  nit: string;
  subdomain: string;
  departments: string[];
}

interface AdminData {
  name: string;
  email: string;
  departmentId: number;
  departmentName: string;
}

interface PlanData {
  id: number;
  name: string;
  description: string;
  storageSize: string;
}

export interface ReviewStepProps {
  company: CompanyData;
  admin: AdminData;
  plan?: PlanData;
}

const ReviewStep = ({ company, admin, plan }: ReviewStepProps) => {
  return (
    <Paper withBorder p="md" radius="md" shadow="sm">
      <Title order={3} size="sm" mb="md">
        Revisa que la información sea correcta antes de enviar
      </Title>
      <Divider my="sm" />
      <Stack gap="sm">
        <Title order={4}>Empresa</Title>
        <Text>
          <strong>Nombre:</strong> {company.name}
        </Text>
        <Text>
          <strong>NIT:</strong> {company.nit}
        </Text>
        <Text>
          <strong>Subdominio:</strong>{' '}
        </Text>
        <Badge color="green" variant="light" tt="none">
          {window.location.protocol}//{company.subdomain}.{import.meta.env.VITE_APP_BASE_URL}
        </Badge>

        <Text>
          <strong>Departamentos:</strong>
        </Text>
        <List spacing="xs" size="sm" withPadding>
          {company.departments.map((dep: string, index: number) => (
            <List.Item key={index}>
              {dep} {index === admin.departmentId && <Badge color="blue" size="xs" ml="xs">Seleccionado</Badge>}
            </List.Item>
          ))}
        </List>

        {plan && (
            <>
              <Text>
                <strong>Plan Seleccionado:</strong>
              </Text>
              <List spacing="xs" size="sm" withPadding>
                <List.Item key={'plan--name'}>
                  <Text>
                    <strong>Nombre:</strong> {plan.name}
                  </Text>
                </List.Item>
                <List.Item key={'plan--desc'}>
                  <Text>
                    <strong>Descripción:</strong> {plan.description}
                  </Text>
                </List.Item>
                <List.Item key={'plan--storage'}>
                  <Text>
                    <strong>Almacenamiento:</strong> {plan.storageSize}
                  </Text>
                </List.Item>
                <List.Item key={'plan--storage'}>
                  <Text>
                    <strong>Precio:</strong> 10 USD
                  </Text>
                </List.Item>
              </List>
            </>
        )}

        <Divider my="sm" />

        <Title order={4}>Usuario Administrador</Title>
        <Text>
          <strong>Nombre:</strong> {admin.name}
        </Text>
        <Text>
          <strong>Email:</strong> {admin.email}
        </Text>
        <Text>
          <strong>Departamento:</strong> {admin.departmentName}
        </Text>
      </Stack>
    </Paper>
  );
};

export default ReviewStep;
