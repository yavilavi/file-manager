import {
  Box,
  Button,
  Group,
  Stepper,
  TextInput,
  PasswordInput,
  Title,
  Notification,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';

export default function CompanyRegistration() {
  const [active, setActive] = useState(0);
  const [departments, setDepartments] = useState(['']);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const form = useForm({
    initialValues: {
      companyName: '',
      nit: '',
      subdomain: '',
      departments: [''],
      adminName: '',
      adminEmail: '',
      adminPassword: '',
      confirmPassword: '',
    },
    validate: (values) => {
      const errors = {
        companyName: '',
        nit: '',
        subdomain: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        confirmPassword: '',
      };
      if (active === 0) {
        if (!values.companyName) errors.companyName = 'Nombre requerido';
        if (!values.nit) errors.nit = 'NIT requerido';
        if (!values.subdomain) errors.subdomain = 'Subdominio requerido';
      }
      if (active === 1) {
        if (!values.adminName) errors.adminName = 'Nombre requerido';
        if (!values.adminEmail) errors.adminEmail = 'Email requerido';
        if (!values.adminPassword)
          errors.adminPassword = 'Contraseña requerida';
        if (values.adminPassword !== values.confirmPassword) {
          errors.confirmPassword = 'Las contraseñas no coinciden';
        }
      }
      return errors;
    },
  });

  const nextStep = () => {
    console.log(form.validate())
    if (form.validate().hasErrors) return;
    setActive((current) => (current < 2 ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const addDepartment = () => {
    setDepartments((prev) => [...prev, '']);
    form.setFieldValue('departments', [...form.values.departments, '']);
  };

  const handleDepartmentChange = (value: string, index: number) => {
    const updated = [...departments];
    updated[index] = value;
    setDepartments(updated);
    form.setFieldValue('departments', updated);
  };

  const handleSubmit = () => {
    if (form.validate().hasErrors) return;
    try {
      // Simulación de envío
      console.log('Data enviada:', form.values);
      setSubmitted(true);
      setError(false);
    } catch (e: unknown) {
      console.log(e)
      setError(true);
    }
  };

  return (
    <Box maw={600} mx="auto">
      <Title order={2} mb="md">
        Registro de empresa
      </Title>

      <Stepper active={active} onStepClick={setActive} size="sm">
        <Stepper.Step label="Empresa" description="Información de la empresa">
          <TextInput
            label="Nombre de la empresa"
            {...form.getInputProps('companyName')}
            mt="md"
          />
          <TextInput label="NIT" {...form.getInputProps('nit')} mt="md" />
          <TextInput
            label="Subdominio"
            {...form.getInputProps('subdomain')}
            mt="md"
          />

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

        <Stepper.Step label="Administrador" description="Usuario principal">
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

        <Stepper.Step label="Revisión" description="Confirmar envío">
          <pre>{JSON.stringify(form.values, null, 2)}</pre>
          {submitted && (
            <Notification title="¡Registro exitoso!" color="green" mt="md" />
          )}
          {error && (
            <Notification title="Error al registrar" color="red" mt="md" />
          )}
        </Stepper.Step>

        <Stepper.Completed>
          <Notification title="¡Listo!" color="green" mt="md">
            Tu empresa ha sido registrada correctamente.
          </Notification>
        </Stepper.Completed>
      </Stepper>

      <Group justify="space-between" mt="xl">
        <Button variant="default" onClick={prevStep} disabled={active === 0}>
          Atrás
        </Button>
        {active < 2 ? (
          <Button onClick={nextStep}>Siguiente</Button>
        ) : (
          <Button onClick={handleSubmit}>Enviar</Button>
        )}
      </Group>
    </Box>
  );
}
