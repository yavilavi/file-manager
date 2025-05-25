/**
 * File Manager - Companyregistration
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
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
  Stack, Image,
  Select,
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
  IconFileInvoice,
} from '@tabler/icons-react';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useCheckSubdomain } from '../../hooks/useCheckSubdomain.ts';
import companySchema from './company.schema.ts';
import administratorSchema from './administrator.schema.ts';
import { AxiosError } from 'axios';
import PlanSelection from '../../components/PlanSelection/PlanSelection.tsx';

export default function CompanyRegistration() {
  const [active, setActive] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(active);
  const [departments, setDepartments] = useState(['Nombre departamento 1']);
  const [departmentOptions, setDepartmentOptions] = useState<{ value: string; label: string }[]>([{ value: '0', label: departments[0] }]);

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
      departmentId: -1,
      planId: null as number | null,
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
        departmentId: null,
      };
      if (active === 0) {
        return zodResolver(companySchema)(values);
      }
      if (active === 1) {
        return zodResolver(administratorSchema)(values);
      }
      return errors;
    },
    transformValues: (values) => ({
      ...values,
      departmentId: Number(values.departmentId)
    }),
  });

  const [debounced] = useDebouncedValue(form.values.subdomain, 500);

  const { data, isFetching } = useCheckSubdomain(debounced);
  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep > 4 || nextStep < 0;
    console.log(form.validate());
    if (form.validate().hasErrors || isOutOfBounds) return;
    if (active === 0 && !data?.available) {
      form.setFieldError('subdomain', 'Debes elegir un subdominio vÃ¡lido');
      return;
    }
    if (active === 1 && form.values.departmentId === -1) {
      form.setFieldError('departmentId', 'Debes seleccionar un departamento');
      return;
    }
    if (active === 2 && !form.values.planId) {
      notifications.show({
        title: 'SelecciÃ³n de plan requerida',
        message: 'Debes seleccionar un plan para continuar',
        color: 'red',
      });
      return;
    }
    setActive((current) => (current < 3 ? current + 1 : current));
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

  const removeDepartment = (index: number) => {
    if (departments.length <= 1) return; // Don't remove the last department
    
    const updated = [...departments];
    updated.splice(index, 1);
    setDepartments(updated);
    form.setFieldValue('departments', updated);
    
    // Update department options
    const options = updated.map((dep, idx) => ({
      value: idx.toString(),
      label: dep,
    }));
    setDepartmentOptions(options);
    
    // Reset departmentId if it was the removed one
    if (form.values.departmentId === index) {
      form.setFieldValue('departmentId', -1);
    }
  };

  const handleDepartmentChange = (value: string, index: number) => {
    const updated = [...departments];
    updated[index] = value;
    setDepartments(updated);
    form.setFieldValue('departments', updated);
    
    // Update department options when departments change
    if (active === 0) {
      const options = updated.map((dep, idx) => ({
        value: idx.toString(),
        label: dep,
      }));
      setDepartmentOptions(options);
    }
  };

  const { mutate, isPending, isSuccess } = useSignup();

  const handleSubmit = () => {
    console.log(form.validate());
    if (form.validate().hasErrors) return;
    if (!form.values.planId) {
      notifications.show({
        title: 'SelecciÃ³n de plan requerida',
        message: 'Debes seleccionar un plan para continuar',
        color: 'red',
      });
      return;
    }
    notifications.clean();
    notifications.show({
      id: 'signup-submit',
      title: 'Espera un momento...',
      message: 'Estamos creando tu espacio de gestiÃ³n documental',
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
          planId: form.values.planId,
        },
        user: {
          name: form.values.adminName,
          email: form.values.adminEmail,
          password: form.values.adminPassword,
          confirmPassword: form.values.confirmPassword,
          departmentId: Number(form.values.departmentId),
        },
      },
      {
        onSuccess: () => {
          notifications.clean();
          setActive(4);
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

  // Update department options when moving to admin step
  useEffect(() => {
    if (active === 1) {
      const options = departments.map((dep, idx) => ({
        value: idx.toString(),
        label: dep,
      }));
      setDepartmentOptions(options);
      // Reset departmentId to -1 when moving to admin step
      form.setFieldValue('departmentId', -1);
    }
  }, [active, departments]);

  if (subdomain !== 'app') {
    return (
      <Loader />
    );
  }
  return (
    <Box maw={800} mx="auto" mt={10}>
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Stack justify="center" align="center" mb="lg">
          <Image
            radius="md"
            src="https://minio.docma.yilmer.com/assets/docma-logo.png"
            style={{
              width: '20%',
            }}
            mb="md"
          />
          <Title order={4} mb="md">
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
              description="InformaciÃ³n de la empresa"
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
                        ? 'Ya estÃ¡ en uso'
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
                <Group key={index} align="flex-end">
                  <TextInput
                    label={`Departamento ${index + 1}`}
                    value={dep}
                    onChange={(e) =>
                      handleDepartmentChange(e.currentTarget.value, index)
                    }
                    mt="md"
                    style={{ flex: 1 }}
                  />
                  {index > 0 && (
                    <Button 
                      color="red" 
                      variant="light" 
                      onClick={() => removeDepartment(index)}
                      mt="md"
                    >
                      Eliminar
                    </Button>
                  )}
                </Group>
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
                label="ContraseÃ±a"
                {...form.getInputProps('adminPassword')}
                mt="md"
              />
              <PasswordInput
                label="Confirmar contraseÃ±a"
                {...form.getInputProps('confirmPassword')}
                mt="md"
              />
              <Select
                label="Departamento"
                placeholder="Selecciona un departamento"
                data={departmentOptions}
                value={form.values.departmentId === -1 ? '' : form.values.departmentId.toString()}
                onChange={(value) => form.setFieldValue('departmentId', value ? Number(value) : -1)}
                required
                mt="md"
                error={form.errors.departmentId}
              />
            </Stepper.Step>

            <Stepper.Step
              icon={<IconFileInvoice size={18} />}
              label="Plan"
              description="SelecciÃ³n de plan"
              allowStepSelect={shouldAllowSelectStep(2)}
              disabled={isSuccess}
            >
              <PlanSelection
                onPlanSelected={(planId) => {
                  form.setFieldValue('planId', planId);
                }}
              />
            </Stepper.Step>

            <Stepper.Step
              icon={<IconListCheck size={18} />}
              label="RevisiÃ³n"
              description="Confirmar envÃ­o"
              allowStepSelect={shouldAllowSelectStep(3)}
              loading={isPending}
              disabled={isSuccess}
            >
              <ReviewStep
                company={{
                  name: form.values.companyName,
                  nit: form.values.nit,
                  subdomain: form.values.subdomain,
                  departments: form.values.departments,
                }}
                admin={{
                  name: form.values.adminName,
                  email: form.values.adminEmail,
                  departmentId: Number(form.values.departmentId),
                  departmentName:
                    departmentOptions.find(
                      (option) => option.value === form.values.departmentId.toString(),
                    )?.label || '',
                }}
              />
            </Stepper.Step>

            <Stepper.Completed>
              <SuccessStep
                subdomain={form.values.subdomain}
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
                AtrÃ¡s
              </Button>
              {active < 3 ? (
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
        </Stack>
      </Paper>
    </Box>
  );
}
