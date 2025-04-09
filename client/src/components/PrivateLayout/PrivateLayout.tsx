import { AppShell, Burger, Group, Loader, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Navigate, Route, Routes } from 'react-router';
import { Navbar } from '../Navbar/Navbar.tsx';
import { validateToken } from '../../services/api/auth.ts';
import { useQuery } from '@tanstack/react-query';
import Documents from '../../apps/documents-manager/Documents.tsx';
import Users from '../../apps/users-manager/Users.tsx';
import Departments from '../../apps/departments-manager/Departments.tsx';

export default function PrivateLayout() {
  const [opened, { toggle }] = useDisclosure();

  const { isLoading, error } = useQuery({
    queryKey: ['validate-token'],
    queryFn: validateToken,
    retry: false,
  });

  if (isLoading) return <Loader />;
  if (error) return <Navigate to="/login" replace />;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Image
            radius="md"
            src="https://minio.docma.yilmer.com/assets/docma-logo.png"
            height={'70%'}
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Navigate to="/documents" replace />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/users" element={<Users />} />
          <Route path="/departments" element={<Departments />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}
