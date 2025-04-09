import { Button, Center, Stack, Title, Text } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router';

function SuccessStep({ redirectUrl }: { redirectUrl: string }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(redirectUrl);
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

      <Button onClick={handleClick} variant="default">
        Ir a iniciar sesión
      </Button>
    </Stack>
  );
}

export default SuccessStep;
