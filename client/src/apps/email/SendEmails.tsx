/**
 * File Manager - Sendemails
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { useMutation } from '@tanstack/react-query';
import { Button, Group, Modal, TextInput, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { sendEmail } from '../../services/api/sendEmail.ts';
import { AxiosError } from 'axios';

export default function SendEmails() {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      to: '',
      subject: '',
      body: '',
    },
    validate: {
      to: (value) => (/^[^@]+@[^@]+\.[^@]+$/.test(value) ? null : 'Correo invÃ¡lido'),
      subject: (value) => (value.length < 3 ? 'Asunto muy corto' : null),
      body: (value) => (value.length < 5 ? 'Mensaje muy corto' : null),
    },
  });

  const emailMutation = useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      notifications.show({
        title: 'Correo enviado',
        message: 'Tu correo ha sido enviado exitosamente',
        color: 'green',
        autoClose: 5000,
      });
      form.reset();
      close();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      notifications.show({
        title: 'Error al enviar correo',
        message: `${error.response?.data.message ?? error.message}`,
        color: 'red',
        autoClose: 5000,
      });
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    emailMutation.mutate(values);
  };

  return (
    <>
      <h3>Enviar correo</h3>
      <Group mb="md">
        <Button onClick={open}>Nuevo correo</Button>
      </Group>

      <Modal
        opened={opened}
        onClose={() => {
          form.reset();
          close();
        }}
        title="Nuevo correo"
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Para" placeholder="usuario@correo.com" {...form.getInputProps('to')} required />
          <TextInput label="Asunto" placeholder="TÃ­tulo del correo" mt="sm" {...form.getInputProps('subject')}
                     required />
          <Textarea label="Mensaje" placeholder="Escribe el contenido del correo"
                    mt="sm" {...form.getInputProps('body')} required minRows={4} />

          <Group mt="lg">
            <Button type="submit" loading={emailMutation.isPending}>Enviar</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
