import { Button, TextInput, PasswordInput, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router';
import authStore from '../stores/auth.store.ts';

export default function Login() {
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const setToken = authStore((state) => state.setToken);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const data = await loginMutation.mutateAsync(values);
      setToken(data.access_token);
      navigate('/documents');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <Paper withBorder shadow="md" p="xl" radius="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Correo" {...form.getInputProps('username')} />
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
  );
}
