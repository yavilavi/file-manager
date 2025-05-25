/**
 * File Manager - Navbar
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { IconArchive, IconBuildings, IconMail, IconUsers, IconBuildingStore, IconCoin, IconPackage } from '@tabler/icons-react';
import { UserButton } from '../UserButton/UserButton';
import { NavLink } from 'react-router';
import classes from './Navbar.module.css';
import clsx from 'clsx';
import LogoutButton from './LogoutButton.tsx';

const links = [
  { icon: IconArchive, label: 'Documentos', path: '/documents' },
  { icon: IconMail, label: 'Email', path: '/email' },
  { icon: IconUsers, label: 'Usuarios', path: '/users' },
  { icon: IconBuildings, label: 'Departamentos', path: '/departments' },
  { icon: IconCoin, label: 'Créditos', path: '/credits' },
  { icon: IconPackage, label: 'Suscripción', path: '/subscription' },
  { icon: IconBuildingStore, label: 'Empresa', path: '/company' },
];

export function Navbar() {
  const mainLinks = links.map((link) => (
    <NavLink
      to={link.path}
      key={link.label}
      className={({ isActive }) =>
        clsx(classes.mainLink, isActive ? classes.mainLinkActive : '')
      }
      style={{ textDecoration: 'none' }}
    >
      <div className={classes.mainLinkInner}>
        <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </div>
    </NavLink>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.section}>
        <UserButton />
      </div>
      <div className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </div>
      <div className={classes.section}>
        <LogoutButton />
      </div>
    </nav>
  );
}
