/**
 * File Manager - Credits
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
  Table, 
  ScrollArea,
  Skeleton,
  Alert,
  Paper,
  Flex,
  Grid
} from '@mantine/core';
import { IconInfoCircle, IconCoin, IconHistory, IconTrendingUp, IconCreditCard } from '@tabler/icons-react';
import { fetchCompanyCredits, fetchCreditTransactions } from '../../services/api/credits';
import useAuthStore from '../../stores/auth.store';
import { formatDate } from '../../utils/formatters';

export default function Credits() {
  const user = useAuthStore((state) => state.user);
  const tenantId = user?.company.tenantId;

  // Fetch company credits
  const { 
    data: credits, 
    isLoading: creditsLoading, 
    error: creditsError 
  } = useQuery({
    queryKey: ['company-credits'],
    queryFn: fetchCompanyCredits,
    enabled: !!tenantId,
  });

  // Fetch credit transactions
  const { 
    data: transactions, 
    isLoading: transactionsLoading 
  } = useQuery({
    queryKey: ['credit-transactions'],
    queryFn: fetchCreditTransactions,
    enabled: !!tenantId,
  });

  const getTransactionTypeColor = (type: 'PURCHASE' | 'USAGE') => {
    return type === 'PURCHASE' ? 'green' : 'red';
  };

  const getTransactionTypeText = (type: 'PURCHASE' | 'USAGE') => {
    return type === 'PURCHASE' ? 'Compra' : 'Uso';
  };

  if (!user) {
    return (
      <Alert icon={<IconInfoCircle size="1rem" />} title="Error" color="red">
        No se pudo obtener la informaciÃ³n del usuario
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      <Title order={2} mb="xs">GestiÃ³n de CrÃ©ditos</Title>

      {/* Credits Overview Cards */}
      <Grid gutter="md">
        {/* Current Balance */}
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Group gap="xs" mb="sm">
              <IconCoin size="1.2rem" color="blue" />
              <Text size="sm" fw={500}>Balance Actual</Text>
            </Group>
            {creditsLoading ? (
              <Skeleton height={24} />
            ) : creditsError ? (
              <Text c="red" size="sm">Error</Text>
            ) : credits ? (
              <Text fw={700} size="xl" c="blue">
                {credits.currentBalance} crÃ©ditos
              </Text>
            ) : (
              <Text c="dimmed" size="sm">--</Text>
            )}
          </Card>
        </Grid.Col>

        {/* Total Purchased */}
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Group gap="xs" mb="sm">
              <IconCreditCard size="1.2rem" color="green" />
              <Text size="sm" fw={500}>Total Comprado</Text>
            </Group>
            {creditsLoading ? (
              <Skeleton height={24} />
            ) : credits ? (
              <Text fw={600} size="lg" c="green">
                {credits.totalPurchased} crÃ©ditos
              </Text>
            ) : (
              <Text c="dimmed" size="sm">--</Text>
            )}
          </Card>
        </Grid.Col>

        {/* Total Used */}
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Group gap="xs" mb="sm">
              <IconTrendingUp size="1.2rem" color="orange" />
              <Text size="sm" fw={500}>Total Usado</Text>
            </Group>
            {creditsLoading ? (
              <Skeleton height={24} />
            ) : credits ? (
              <Text fw={600} size="lg" c="orange">
                {credits.totalPurchased - credits.currentBalance} crÃ©ditos
              </Text>
            ) : (
              <Text c="dimmed" size="sm">--</Text>
            )}
          </Card>
        </Grid.Col>

        {/* Last Purchase */}
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Group gap="xs" mb="sm">
              <IconHistory size="1.2rem" color="gray" />
              <Text size="sm" fw={500}>Ãšltima Compra</Text>
            </Group>
            {creditsLoading ? (
              <Skeleton height={24} />
            ) : credits ? (
              <Text fw={500} size="sm">
                {credits.lastPurchaseAt 
                  ? formatDate(credits.lastPurchaseAt)
                  : 'Nunca'
                }
              </Text>
            ) : (
              <Text c="dimmed" size="sm">--</Text>
            )}
          </Card>
        </Grid.Col>
      </Grid>

      {/* Detailed Credit Information */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group gap="xs" mb="md">
          <IconCoin size="1.4rem" />
          <Title order={3}>InformaciÃ³n Detallada de CrÃ©ditos</Title>
        </Group>
        
        {creditsLoading ? (
          <Grid gutter="md">
            <Grid.Col span={4}><Skeleton height={16} /></Grid.Col>
            <Grid.Col span={4}><Skeleton height={16} /></Grid.Col>
            <Grid.Col span={4}><Skeleton height={16} /></Grid.Col>
          </Grid>
        ) : creditsError ? (
          <Alert icon={<IconInfoCircle size="1rem" />} title="Error" color="red">
            No se pudieron cargar los crÃ©ditos: {creditsError.message}
          </Alert>
        ) : credits ? (
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Flex justify="space-between" align="center">
                <Text size="sm" c="dimmed">CrÃ©ditos Disponibles</Text>
                <Text fw={600} size="lg" c="blue">{credits.currentBalance}</Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Flex justify="space-between" align="center">
                <Text size="sm" c="dimmed">Total Adquirido</Text>
                <Text fw={500}>{credits.totalPurchased}</Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Flex justify="space-between" align="center">
                <Text size="sm" c="dimmed">Total Consumido</Text>
                <Text fw={500} c="orange">{credits.totalPurchased - credits.currentBalance}</Text>
              </Flex>
            </Grid.Col>
          </Grid>
        ) : (
          <Text c="dimmed" ta="center">No hay informaciÃ³n de crÃ©ditos disponible</Text>
        )}
      </Card>

      {/* Credit Transactions History */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group gap="xs" mb="md">
          <IconHistory size="1.4rem" />
          <Title order={3}>Historial de Movimientos</Title>
        </Group>
        
        {transactionsLoading ? (
          <Stack gap="xs">
            <Skeleton height={16} />
            <Skeleton height={16} />
            <Skeleton height={16} />
          </Stack>
        ) : transactions && transactions.length > 0 ? (
          <ScrollArea>
            <Table striped highlightOnHover withTableBorder={false}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Fecha</Table.Th>
                  <Table.Th>Tipo</Table.Th>
                  <Table.Th>Cantidad</Table.Th>
                  <Table.Th>DescripciÃ³n</Table.Th>
                  <Table.Th>Estado</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {transactions.map((transaction) => (
                  <Table.Tr key={transaction.id}>
                    <Table.Td>
                      <Text size="sm">
                        {formatDate(transaction.createdAt)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        size="sm"
                        color={getTransactionTypeColor(transaction.transactionType)}
                        variant="light"
                      >
                        {getTransactionTypeText(transaction.transactionType)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text 
                        size="sm"
                        c={transaction.transactionType === 'PURCHASE' ? 'green' : 'red'}
                        fw={600}
                      >
                        {transaction.transactionType === 'PURCHASE' ? '+' : '-'}
                        {transaction.amount} crÃ©ditos
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {transaction.description || 'Sin descripciÃ³n'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" color="green" variant="light">
                        Completado
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        ) : (
          <Paper p="md" bg="gray.1">
            <Text c="dimmed" ta="center">
              No hay movimientos de crÃ©ditos registrados
            </Text>
          </Paper>
        )}
      </Card>
    </Stack>
  );
} 