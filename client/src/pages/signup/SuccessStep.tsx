import { Button, Center, Stack, Title, Text } from '@mantine/core';
import { IconCircleCheck, IconRocket } from '@tabler/icons-react';

function SuccessStep({ redirectUrl }: { redirectUrl: string }) {

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
