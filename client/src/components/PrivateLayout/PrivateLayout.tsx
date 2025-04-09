import { AppShell, Box, Burger, Group, Loader, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import formatFileSize from '../../utils/format-file-size.util.ts';
import { Navigate, Route, Routes } from 'react-router';
import useFileManagerStore from '../../stores/file-manager.store.ts';
import { Navbar } from '../Navbar/Navbar.tsx';
import { validateToken } from '../../services/api/auth.ts';
import { useQuery } from '@tanstack/react-query';
import Documents from '../../apps/documents-manager/Documents.tsx';
import Users from '../../apps/users-manager/Users.tsx';
import Departments from '../../apps/departments-manager/Departments.tsx';

export default function PrivateLayout() {
  const [opened, { toggle }] = useDisclosure();
  const { selectedFile } = useFileManagerStore();
  const { clearSelectedFile } = useFileManagerStore();

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
      aside={{
        width: 300,
        breakpoint: 'md',
        collapsed: { desktop: false, mobile: true },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <MantineLogo size={30} />
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
      <AppShell.Aside p="md">
        {selectedFile && (
          <Box>
            <h4>Selected File info</h4>
            <h3>{selectedFile.name}</h3>
            <p>{formatFileSize(selectedFile.size)}</p>
            <Text size="xs" lineClamp={2}>
              {selectedFile.hash}
            </Text>
            <button onClick={clearSelectedFile}>Clear</button>
          </Box>
        )}
        {!selectedFile && (
          <Box>
            <h4>Este espacio está en construcción</h4>
          </Box>
        )}
      </AppShell.Aside>
    </AppShell>
  );
}
