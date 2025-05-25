/**
 * File Manager - Privatelayout
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import {AppShell, Burger, Group, Image, Badge} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Navigate, Route, Routes, useNavigate} from 'react-router';
import {Navbar} from '../Navbar/Navbar.tsx';
import Documents from '../../apps/documents-manager/Documents.tsx';
import Users from '../../apps/users-manager/Users.tsx';
import Departments from '../../apps/departments-manager/Departments.tsx';
import SendEmails from '../../apps/email/SendEmails.tsx';
import Company from '../../pages/company/Company.tsx';
import Credits from '../../pages/credits/Credits.tsx';
import Subscription from '../../pages/subscription/Subscription.tsx';
import { useEffect, useState } from 'react';
import { useCheckCompanyPlan } from '../../hooks/useCheckCompanyPlan.ts';
import { useQuery } from '@tanstack/react-query';
import { fetchCompanyCredits } from '../../services/api/credits';
import { IconCoin } from '@tabler/icons-react';

export default function PrivateLayout() {
    const [opened, {toggle}] = useDisclosure();
    const [tenantId, setTenantId] = useState<string>('');
    const navigate = useNavigate();
    
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
    
    // Fetch credits for header display
    const { 
        data: credits 
    } = useQuery({
        queryKey: ['company-credits'],
        queryFn: fetchCompanyCredits,
        enabled: !!tenantId,
        refetchInterval: 30000, // Refetch every 30 seconds
    });

    const handleCreditsClick = () => {
        navigate('/credits');
    };
    
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
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                        <Image
                            radius="md"
                            src="https://minio.docma.yilmer.com/assets/docma-logo.png"
                            height={40}
                        />
                    </Group>
                    
                    {/* Credits Balance Chip */}
                    {credits && (
                        <Badge 
                            size="lg" 
                            variant="light" 
                            color="blue"
                            leftSection={<IconCoin size="0.9rem" />}
                            style={{ cursor: 'pointer' }}
                            onClick={handleCreditsClick}
                        >
                            {credits.currentBalance} crÃ©ditos
                        </Badge>
                    )}
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
                    <Route path="/credits" element={<Credits/>}/>
                    <Route path="/subscription" element={<Subscription/>}/>
                    <Route path="/company" element={<Company/>}/>
                </Routes>
            </AppShell.Main>
        </AppShell>
    );
}
