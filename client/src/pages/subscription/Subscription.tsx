/**
 * File Manager - Subscription
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  Text, 
  Title, 
  Group, 
  Stack, 
  Badge, 
  Grid,
  Skeleton,
  Alert,
  Progress,
  Flex,
  Button,
  Paper
} from '@mantine/core';
import { IconInfoCircle, IconPackage, IconCalendar, IconDatabase, IconCreditCard, IconTrendingUp } from '@tabler/icons-react';
import { fetchCompanyPlan } from '../../services/api/plans';
import { fetchCreditTransactions } from '../../services/api/credits';
import useAuthStore from '../../stores/auth.store';
import { formatDate } from '../../utils/formatters';

export default function Subscription() {
  const user = useAuthStore((state) => state.user);
  const tenantId = user?.company.tenantId;

  // Fetch company plan
  const { 
    data: companyPlan, 
    isLoading: planLoading,
    error: planError 
  } = useQuery({
    queryKey: ['company-plan', tenantId],
    queryFn: () => fetchCompanyPlan(tenantId!),
    enabled: !!tenantId,
  });

  // Fetch credit transactions for billing history
  const { 
    data: transactions, 
    isLoading: transactionsLoading 
  } = useQuery({
    queryKey: ['credit-transactions'],
    queryFn: fetchCreditTransactions,
    enabled: !!tenantId,
  });

  const formatStorageSize = (bytes: string) => {
    const bytesNum = parseInt(bytes);
    if (bytesNum >= 1024 * 1024 * 1024) {
      return `${(bytesNum / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    } else if (bytesNum >= 1024 * 1024) {
      return `${(bytesNum / (1024 * 1024)).toFixed(2)} MB`;
    } else if (bytesNum >= 1024) {
      return `${(bytesNum / 1024).toFixed(2)} KB`;
    }
    return `${bytesNum} bytes`;
  };

  const calculateStoragePercentage = () => {
    if (!companyPlan?.plan?.storageSize || !companyPlan.storageUsed) return 0;
    const totalStorage = parseInt(companyPlan.plan.storageSize);
    const usedStorage = parseInt(companyPlan.storageUsed);
    return Math.min((usedStorage / totalStorage) * 100, 100);
  };

  const getStorageColor = (percentage: number) => {
    if (percentage >= 90) return 'red';
    if (percentage >= 75) return 'orange';
    return 'blue';
  };

  const purchaseTransactions = transactions?.filter(t => t.transactionType === 'PURCHASE') || [];

  if (!user) {
    return (
      <Alert icon={<IconInfoCircle size="1rem" />} title="Error" color="red">
        No se pudo obtener la informaciÃ³n del usuario
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={2}>SuscripciÃ³n y Plan</Title>
        <Button variant="light" color="blue">
          Cambiar Plan
        </Button>
      </Group>

      {/* Plan Overview */}
      {planLoading ? (
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Stack gap="sm">
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
          </Stack>
        </Card>
      ) : planError ? (
        <Alert icon={<IconInfoCircle size="1rem" />} title="Error" color="red">
          No se pudo cargar la informaciÃ³n del plan
        </Alert>
      ) : companyPlan ? (
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group gap="xs" mb="md">
            <IconPackage size="1.4rem" color="blue" />
            <Title order={3}>Plan Actual</Title>
            <Badge color={companyPlan.isActive ? 'green' : 'red'} variant="light">
              {companyPlan.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </Group>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="sm">
                <div>
                  <Text size="sm" c="dimmed">Nombre del Plan</Text>
                  <Text fw={600} size="lg">{companyPlan.plan?.name}</Text>
                </div>
                
                <div>
                  <Text size="sm" c="dimmed">DescripciÃ³n</Text>
                  <Text size="sm">{companyPlan.plan?.description}</Text>
                </div>

                <div>
                  <Text size="sm" c="dimmed">Fecha de Inicio</Text>
                  <Text size="sm">{formatDate(companyPlan.startDate)}</Text>
                </div>

                {companyPlan.endDate && (
                  <div>
                    <Text size="sm" c="dimmed">Fecha de Vencimiento</Text>
                    <Text size="sm">{formatDate(companyPlan.endDate)}</Text>
                  </div>
                )}
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="sm">
                <div>
                  <Flex justify="space-between" align="center" mb="xs">
                    <Text size="sm" c="dimmed">Almacenamiento</Text>
                    <Text size="xs" c="dimmed">
                      {formatStorageSize(companyPlan.storageUsed)} / {formatStorageSize(companyPlan.plan?.storageSize || '0')}
                    </Text>
                  </Flex>
                  <Progress 
                    value={calculateStoragePercentage()} 
                    color={getStorageColor(calculateStoragePercentage())}
                    size="lg"
                  />
                  <Text size="xs" c="dimmed" mt="xs">
                    {calculateStoragePercentage().toFixed(1)}% utilizado
                  </Text>
                </div>

                {companyPlan.plan?.creditsIncluded && companyPlan.plan.creditsIncluded > 0 && (
                  <div>
                    <Text size="sm" c="dimmed">CrÃ©ditos Incluidos</Text>
                    <Text fw={500} c="blue">{companyPlan.plan.creditsIncluded} crÃ©ditos/mes</Text>
                  </div>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Card>
      ) : (
        <Alert icon={<IconInfoCircle size="1rem" />} title="Sin Plan" color="yellow">
          No tienes un plan asignado. Contacta a soporte para obtener uno.
        </Alert>
      )}

      {/* Plan Features */}
      {companyPlan?.plan && (
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group gap="xs" mb="md">
            <IconTrendingUp size="1.4rem" color="orange" />
            <Title order={3}>CaracterÃ­sticas del Plan</Title>
          </Group>
          
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Group gap="xs">
                <IconDatabase size="1rem" color="blue" />
                <div>
                  <Text size="sm" fw={500}>Almacenamiento</Text>
                  <Text size="xs" c="dimmed">
                    {formatStorageSize(companyPlan.plan.storageSize)}
                  </Text>
                </div>
              </Group>
            </Grid.Col>
            
            {companyPlan.plan.creditsIncluded > 0 && (
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <Group gap="xs">
                  <IconCreditCard size="1rem" color="green" />
                  <div>
                    <Text size="sm" fw={500}>CrÃ©ditos Mensuales</Text>
                    <Text size="xs" c="dimmed">
                      {companyPlan.plan.creditsIncluded} crÃ©ditos
                    </Text>
                  </div>
                </Group>
              </Grid.Col>
            )}
            
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Group gap="xs">
                <IconCalendar size="1rem" color="orange" />
                <div>
                  <Text size="sm" fw={500}>Estado del Plan</Text>
                  <Text size="xs" c="dimmed">
                    {companyPlan.isActive ? 'Activo y vigente' : 'Inactivo'}
                  </Text>
                </div>
              </Group>
            </Grid.Col>
          </Grid>
        </Card>
      )}      

      {/* Billing History */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group gap="xs" mb="md">
          <IconCreditCard size="1.4rem" color="green" />
          <Title order={3}>Historial de Compras</Title>
        </Group>
        
        {transactionsLoading ? (
          <Stack gap="xs">
            <Skeleton height={16} />
            <Skeleton height={16} />
            <Skeleton height={16} />
          </Stack>
        ) : purchaseTransactions.length > 0 ? (
          <Stack gap="sm">
            {purchaseTransactions.map((transaction) => (
              <Paper key={transaction.id} p="sm" bg="gray.0" radius="sm">
                <Flex justify="space-between" align="center">
                  <div>
                    <Text fw={500} size="sm">
                      {transaction.description || 'Compra de crÃ©ditos'}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {formatDate(transaction.createdAt)}
                    </Text>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text fw={600} c="green" size="sm">
                      +{transaction.amount} crÃ©ditos
                    </Text>
                    <Badge size="xs" color="green" variant="light">
                      Completado
                    </Badge>
                  </div>
                </Flex>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Paper p="md" bg="gray.1">
            <Text c="dimmed" ta="center">
              No hay compras registradas
            </Text>
          </Paper>
        )}
      </Card>
    </Stack>
  );
} 