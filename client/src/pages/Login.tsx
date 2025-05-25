/**
 * File Manager - Login
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import {
  Button,
  TextInput,
  PasswordInput,
  Paper,
  Box,
  Title, Loader, Text,
  Image, Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router';
import authStore from '../stores/auth.store.ts';
import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import useTenantValidation from '../hooks/useTenantValidation.ts';

export default function Login() {
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const setToken = authStore((state) => state.setToken);
  const tenantQuery = useTenantValidation();

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
      if (!password || password.trim() === '') {
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
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string; statusCode: number; error: string }>;
      console.error('Login error', error);
      notifications.show({
        title: 'Error al iniciar sesión',
        message: `${error.response?.data.message ?? error.message}`,
        color: 'red',
        autoClose: 5000,
      });
    }
  };


  if (tenantQuery.isPending) {
    return <Loader />;
  }

  if (tenantQuery.isError || tenantQuery.data?.available === true) {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    return (
      <Box maw={400} mx="auto" mt={150}>
        <Paper withBorder shadow="md" p="xl" radius="md">
          <Title order={2} mb="sm">¡Ups! Parece que te perdiste</Title>
          <Text>
            El subdominio <b>{subdomain}</b> aún no está registrado por ninguna empresa.
            ¡Apresúrate y crea tu cuenta antes de que alguien más registre <b>{subdomain}</b>!
          </Text>
          <Button
            mt="xl"
            fullWidth
            color="blue"
            onClick={() => window.location.href = `${window.location.protocol}//app.${import.meta.env.VITE_APP_BASE_URL}/signup`}
          >
            Registrarse
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box maw={400} mx="auto" mt={150}>
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Stack justify="center" align="center" mb="lg">
          <Image
            radius="md"
            src="https://minio.docma.yilmer.com/assets/docma-logo.png"
            style={{
              width: '60%',
            }}
            mb="md"
          />
          <Title order={4}>
            Iniciar sesión
          </Title>
          <form
            onSubmit={form.onSubmit(handleSubmit)}
            style={{ width: '100%', marginTop: '.5rem' }}
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
        </Stack>
      </Paper>
    </Box>
  );
}
