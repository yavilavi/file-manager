import { Button, Center, Stack, Title, Text } from '@mantine/core';
import { IconCircleCheck, IconRocket } from '@tabler/icons-react';

interface SuccessStepProps {
  subdomain: string;
}

function SuccessStep({ subdomain }: SuccessStepProps) {
  const redirectUrl = `${window.location.protocol}//${subdomain}.${import.meta.env.VITE_APP_BASE_URL}`;

  const handleClick = () => {
    window.location.href = redirectUrl;
  };

  return (
    <Stack align="center" justify="center" mt="xl">
      <Center>
        <IconCircleCheck size={64} color="green" />
      </Center>
      <Title order={2} ta="center">
        ¡Registro exitoso!
      </Title>
      <Text c="dimmed" ta="center">
        Tu empresa ha sido registrada correctamente.
      </Text>

      <Text c="dimmed" ta="center">
        Serás redirigido a {redirectUrl} para iniciar sesión.
      </Text>

      <Button onClick={handleClick} rightSection={<IconRocket size={20} />}>
        Ir a iniciar sesión
      </Button>
    </Stack>
  );
}

export default SuccessStep;
