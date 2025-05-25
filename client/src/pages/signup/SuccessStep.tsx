/**
 * File Manager - Successstep
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Button, Center, Stack, Title, Text } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';

interface SuccessStepProps {
  subdomain: string;
}

function SuccessStep({ subdomain }: SuccessStepProps) {
  const redirectUrl = `${window.location.protocol}//${subdomain}.${import.meta.env.VITE_APP_BASE_URL}`;

  return (
    <Stack align="center" justify="center" mt="xl">
      <Center>
        <IconCircleCheck size={64} color="green" />
      </Center>
      <Title order={2} ta="center">
        Â¡Registro exitoso!
      </Title>
      <Text c="dimmed" ta="center">
        Tu empresa ha sido registrada correctamente.
      </Text>

      <Text>
        Serás redirigido a {redirectUrl} para iniciar sesión.
      </Text>

      <Button component="a" href={redirectUrl} mt="xl" fullWidth>
        Ir a iniciar sesión
      </Button>
    </Stack>
  );
}

export default SuccessStep;
