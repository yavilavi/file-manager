/**
 * File Manager - Planselection
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { useState } from 'react';
import { 
  Card, 
  Title, 
  Text, 
  Group, 
  Badge, 
  Button, 
  Stack, 
  Paper, 
  SimpleGrid, 
  Container,
  Loader,
  Center,
  Box
} from '@mantine/core';
import { useFetchActivePlans } from '../../hooks/usePlans';

// Format bytes utility function
function formatBytes(bytes: bigint, decimals: number = 2): string {
  if (bytes === BigInt(0)) return '0 Bytes';

  const k = BigInt(1024);
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  let i = 0;
  let bytesNumber = bytes;

  while (bytesNumber >= k && i < sizes.length - 1) {
    bytesNumber = bytesNumber / k;
    i++;
  }

  // Convert to number for formatting decimals
  const bytesAsNumber = Number(bytesNumber);
  return `${bytesAsNumber.toFixed(dm)} ${sizes[i]}`;
}

interface PlanSelectionProps {
  onPlanSelected?: (planId: number) => void;
}

export default function PlanSelection({ onPlanSelected }: PlanSelectionProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const { data: plans, isLoading, error } = useFetchActivePlans();

  const handleSelectPlan = (planId: number) => {
    setSelectedPlanId(planId);
    
    // Trigger callback immediately
    if (onPlanSelected) {
      onPlanSelected(planId);
    }
  };

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container>
        <Paper p="md" withBorder>
          <Text color="red" fw={500}>Error cargando planes: {error.message}</Text>
          <Button mt="md" variant="outline" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <Container>
        <Paper p="md" withBorder>
          <Text>No hay planes disponibles en este momento.</Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Box mb="xl">
        <Title order={2} ta="center" mb="sm">Selecciona un plan</Title>
        <Text ta="center" c="dimmed" mb="xl">
          Escoge el plan que mejor se adapte a tus necesidades
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2, md: plans.length > 2 ? 3 : 2 }} spacing="lg">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            withBorder 
            padding="lg"
            radius="md"
            h="100%"
            style={{
              borderColor: selectedPlanId === plan.id ? 'var(--mantine-color-blue-6)' : undefined,
              borderWidth: selectedPlanId === plan.id ? '2px' : '1px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={() => handleSelectPlan(plan.id)}
          >
            <Card.Section withBorder inheritPadding py="xs">
              <Group justify="space-between">
                <Title order={3}>{plan.name}</Title>
                {selectedPlanId === plan.id && (
                  <Badge color="blue">Seleccionado</Badge>
                )}
              </Group>
            </Card.Section>

            <Stack mt="md" flex={1}>
              <Text>{plan.description}</Text>
              <Text fw={700} size="xl" mt="auto">
                {formatBytes(BigInt(plan.storageSize))}
              </Text>
              {plan.creditsIncluded > 0 && (
                <Text fw={500} c="blue" size="sm">
                  Incluye {plan.creditsIncluded} créditos
                </Text>
              )}
            </Stack>

            <Button 
              fullWidth 
              variant={selectedPlanId === plan.id ? "filled" : "light"}
              mt="md"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectPlan(plan.id);
              }}
            >
              Elegir plan
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
} 