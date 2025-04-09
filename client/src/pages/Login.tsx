import {
  Button,
  TextInput,
  PasswordInput,
  Paper,
  Box,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router';
import authStore from '../stores/auth.store.ts';
import { notifications } from '@mantine/notifications';

export default function Login() {
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const setToken = authStore((state) => state.setToken);

  const form = useForm<{ username: null | string; password: null | string }>({
    initialValues: {
      username: null,
      password: null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const { username, password } = values;
      if (!username) {
        form.setFieldError('username', 'El correo es requerido');
        return;
      }
      if (!password) {
        form.setFieldError('password', 'La contraseña es requerida');
        return;
      }
      if (username && password) {
        const data = await loginMutation.mutateAsync({
          username,
          password,
        });
        setToken(data.access_token);
        navigate('/documents');
      }
    } catch (error) {
      console.error('Login error', error);
      notifications.show({
        title: 'Error al iniciar sesión',
        message:
          'No se pudo iniciar sesión con las credenciales proporcionadas',
        color: 'red',
        autoClose: 5000,
      });
    }
  };

  return (
    <Box maw={400} mx="auto" mt={150}>
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} mb="md">
          Iniciar sesión
        </Title>
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          style={{ width: '100%', marginTop: '3rem' }}
        >
          <TextInput
            label="Correo"
            {...form.getInputProps('username')}
            type="email"
          />
          <PasswordInput
            label="Contraseña"
            mt="md"
            {...form.getInputProps('password')}
          />
          <Button
            type="submit"
            mt="xl"
            fullWidth
            loading={loginMutation.isPending}
          >
            Iniciar sesión
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
