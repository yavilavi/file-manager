import {AppShell, Burger, Group, Image} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Navigate, Route, Routes} from 'react-router';
import {Navbar} from '../Navbar/Navbar.tsx';
import Documents from '../../apps/documents-manager/Documents.tsx';
import Users from '../../apps/users-manager/Users.tsx';
import Departments from '../../apps/departments-manager/Departments.tsx';
import SendEmails from '../../apps/email/SendEmails.tsx';
import { useEffect, useState } from 'react';
import { useCheckCompanyPlan } from '../../hooks/useCheckCompanyPlan.ts';

export default function PrivateLayout() {
    const [opened, {toggle}] = useDisclosure();
    const [tenantId, setTenantId] = useState<string>('');
    
    // Extract tenant ID from hostname
    useEffect(() => {
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        
        if (subdomain && subdomain !== 'app') {
            setTenantId(subdomain);
        }
    }, []);
    
    // Check if company has a plan
    const { isLoading } = useCheckCompanyPlan(tenantId);
    
    // Show loading state while checking plan
    if (isLoading && tenantId) {
        return <div>Cargando...</div>;
    }
    
    return (
        <AppShell
            header={{height: 60}}
            navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !opened}}}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                    <Image
                        radius="md"
                        src="https://minio.docma.yilmer.com/assets/docma-logo.png"
                        height={'70%'}
                    />
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Navbar/>
            </AppShell.Navbar>
            <AppShell.Main>
                <Routes>
                    <Route path="/" element={<Navigate to="/documents" replace/>}/>
                    <Route path="/documents" element={<Documents/>}/>
                    <Route path="/email" element={<SendEmails/>}/>
                    <Route path="/users" element={<Users/>}/>
                    <Route path="/departments" element={<Departments/>}/>
                </Routes>
            </AppShell.Main>
        </AppShell>
    );
}
