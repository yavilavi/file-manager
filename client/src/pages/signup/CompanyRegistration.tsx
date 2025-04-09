import {
  Box,
  Button,
  Group,
  Stepper,
  TextInput,
  PasswordInput,
  Title,
  Paper,
  Loader,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { useSignup } from '../../hooks/useSignup.ts';
import { notifications } from '@mantine/notifications';
import ReviewStep from './ReviewStep.tsx';
import SuccessStep from './SuccessStep.tsx';
import { useDebouncedValue } from '@mantine/hooks';
import {
  IconCircleCheck,
  IconBuildingCommunity,
  IconUser,
  IconListCheck,
} from '@tabler/icons-react';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useCheckSubdomain } from '../../hooks/useCheckSubdomain.ts';
import companySchema from './company.schema.ts';
import administratorSchema from './administrator.schema.ts';
import { AxiosError } from 'axios';

export default function CompanyRegistration() {
  const [active, setActive] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(active);
  const [departments, setDepartments] = useState(['Nombre departamento 1']);

  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];
  useEffect(() => {
    if (subdomain !== 'app') {
      window.location.href = `${window.location.protocol}//app.${import.meta.env.VITE_APP_BASE_URL}/signup`;
    }
  }, [subdomain]);

  const form = useForm({
    initialValues: {
      companyName: '',
      nit: '',
      subdomain: '',
      departments: ['Nombre departamento 1'],
      adminName: '',
      adminEmail: '',
      adminPassword: '',
      confirmPassword: '',
    },
    validate: (values) => {
      const errors = {
        companyName: null,
        nit: null,
        subdomain: null,
        adminName: null,
        adminEmail: null,
        adminPassword: null,
        confirmPassword: null,
      };
      if (active === 0) {
        return zodResolver(companySchema)(values);
      }
      if (active === 1) {
        return zodResolver(administratorSchema)(values);
      }
      return errors;
    },
  });

  const [debounced] = useDebouncedValue(form.values.subdomain, 500);

  const { data, isFetching } = useCheckSubdomain(debounced);
  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep > 3 || nextStep < 0;
    console.log(form.validate());
    if (form.validate().hasErrors || isOutOfBounds) return;
    if (active === 0 && !data?.available) {
      form.setFieldError('subdomain', 'Debes elegir un subdominio válido');
      return;
    }
    setActive((current) => (current < 2 ? current + 1 : current));
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const addDepartment = () => {
    setDepartments((prev) => [
      ...prev,
      `Nombre departamento ${departments.length + 1}`,
    ]);
    form.setFieldValue('departments', [
      ...form.values.departments,
      `Nombre departamento ${departments.length + 1}`,
    ]);
  };

  const handleDepartmentChange = (value: string, index: number) => {
    const updated = [...departments];
    updated[index] = value;
    setDepartments(updated);
    form.setFieldValue('departments', updated);
  };

  const { mutate, isPending, isSuccess } = useSignup();

  const handleSubmit = () => {
    console.log(form.validate());
    if (form.validate().hasErrors) return;
    notifications.clean();
    notifications.show({
      id: 'signup-submit',
      title: 'Espera un momento...',
      message: 'Estamos creando tu espacio de gestión documental',
      loading: true,
      autoClose: false,
    });
    mutate(
      {
        company: {
          name: form.values.companyName,
          nit: form.values.nit,
          tenantId: form.values.subdomain,
          departments: form.values.departments.map((dep) => ({
            name: dep,
          })),
        },
        user: {
          name: form.values.adminName,
          email: form.values.adminEmail,
          password: form.values.adminPassword,
          confirmPassword: form.values.confirmPassword,
        },
      },
      {
        onSuccess: () => {
          notifications.clean();
          setActive(3);
        },
        onError: (data) => {
          const error = data as AxiosError<{
            message: string;
            error: string;
            statusCode: number;
          }>;
          notifications.update({
            id: 'signup-submit',
            title: 'Ups! no pudimos crear tu cuenta',
            message: `${error.response?.data.message ?? data.message}`,
            loading: false,
            autoClose: 3000,
            color: 'red',
          });
          if (error.response?.status === 409 || error.status == 409) {
            form.setFieldError('nit', 'Ya existe una empresa registrada con este NIT');
            setActive(0);
          }
        },
      },
    );
  };
  const shouldAllowSelectStep = (step: number) =>
    highestStepVisited >= step && active !== step;

  if (subdomain !== 'app') {
    return (
      <Loader />
    );
  }
  return (
    <Box maw={800} mx="auto" mt={150}>
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} mb="md">
          Registro de empresa
        </Title>

        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
          size="sm"
          mt="2rem"
          completedIcon={<IconCircleCheck size={18} />}
        >
          <Stepper.Step
            icon={<IconBuildingCommunity size={18} />}
            label="Empresa"
            description="Información de la empresa"
            allowStepSelect={shouldAllowSelectStep(0)}
            disabled={isSuccess}
          >
            <TextInput
              label="Nombre de la empresa"
              {...form.getInputProps('companyName')}
              mt="md"
            />
            <TextInput label="NIT" {...form.getInputProps('nit')} mt="md" />

            <Group justify="start" align="end">
              <TextInput
                label="Subdominio"
                {...form.getInputProps('subdomain')}
                mt="md"
                rightSectionPointerEvents="none"
                rightSection={
                  isFetching ? (
                    <Loader size={16} />
                  ) : data && !data.available ? (
                    <IconCircleCheck size={16} color="red" />
                  ) : data && data.available ? (
                    <IconCircleCheck size={16} color="green" />
                  ) : null
                }
                description={
                  debounced.length < 3
                    ? 'Escribe al menos 3 letras'
                    : data && !data.available
                      ? 'Ya está en uso'
                      : data && data.available
                        ? 'Disponible'
                        : 'Verificando...'
                }
              />
              <Badge color="blue" variant="light">
                .{import.meta.env.VITE_APP_BASE_URL}
              </Badge>
            </Group>
            {departments.map((dep, index) => (
              <TextInput
                key={index}
                label={`Departamento ${index + 1}`}
                value={dep}
                onChange={(e) =>
                  handleDepartmentChange(e.currentTarget.value, index)
                }
                mt="md"
              />
            ))}
            <Button onClick={addDepartment} variant="light" mt="sm">
              Agregar otro departamento
            </Button>
          </Stepper.Step>

          <Stepper.Step
            icon={<IconUser size={18} />}
            label="Administrador"
            description="Usuario principal"
            allowStepSelect={shouldAllowSelectStep(1)}
            disabled={isSuccess}
          >
            <TextInput
              label="Nombre"
              {...form.getInputProps('adminName')}
              mt="md"
            />
            <TextInput
              label="Correo"
              {...form.getInputProps('adminEmail')}
              mt="md"
            />
            <PasswordInput
              label="Contraseña"
              {...form.getInputProps('adminPassword')}
              mt="md"
            />
            <PasswordInput
              label="Confirmar contraseña"
              {...form.getInputProps('confirmPassword')}
              mt="md"
            />
          </Stepper.Step>

          <Stepper.Step
            icon={<IconListCheck size={18} />}
            label="Revisión"
            description="Confirmar envío"
            allowStepSelect={shouldAllowSelectStep(2)}
            loading={isPending}
            disabled={isSuccess}
          >
            <ReviewStep form={form} />
          </Stepper.Step>

          <Stepper.Completed>
            <SuccessStep
              redirectUrl={`${window.location.protocol}//${form.values.subdomain}.${import.meta.env.VITE_APP_BASE_URL}`}
            />
          </Stepper.Completed>
        </Stepper>

        {!isSuccess && (
          <Group justify="space-between" mt="xl">
            <Button
              variant="default"
              onClick={prevStep}
              disabled={active === 0}
            >
              Atrás
            </Button>
            {active < 2 ? (
              <Button onClick={() => handleStepChange(active + 1)}>
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={isPending}
                disabled={isPending}
              >
                Enviar
              </Button>
            )}
          </Group>
        )}
      </Paper>
    </Box>
  );
}
