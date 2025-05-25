/**
 * File Manager - Planselectionpage
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Box, Container, Paper, Title, Text } from '@mantine/core';
import PlanSelection from '../../components/PlanSelection/PlanSelection';
import { useEffect, useState } from 'react';

export default function PlanSelectionPage() {
  const [tenantId, setTenantId] = useState('');
  
  useEffect(() => {
    // Extract tenant ID from hostname
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    if (subdomain && subdomain !== 'app') {
      setTenantId(subdomain);
    }
  }, []);
  
  const handlePlanSelected = () => {
    // Redirect to dashboard after plan selection
    window.location.href = '/';
  };
  
  return (
    <Container size="xl">
      <Paper p="xl" radius="md" withBorder shadow="md" my="xl">
        <Box mb="xl" ta="center">
          <Title>SelecciÃ³n de Plan</Title>
          <Text c="dimmed">
            Para continuar usando la plataforma, debes seleccionar un plan
          </Text>
        </Box>
        
        {tenantId ? (
          <PlanSelection onPlanSelected={handlePlanSelected} />
        ) : (
          <Text ta="center" c="red">
            No se pudo determinar el ID de tu empresa. Por favor contacta a soporte.
          </Text>
        )}
      </Paper>
    </Container>
  );
} 