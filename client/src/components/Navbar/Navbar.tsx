import { IconArchive, IconUsers } from '@tabler/icons-react';
import { UserButton } from '../UserButton/UserButton';
import { NavLink } from 'react-router';
import classes from './Navbar.module.css';
import clsx from 'clsx';

const links = [
  { icon: IconArchive, label: 'Documentos', path: '/documents' },
  { icon: IconUsers, label: 'Usuarios', path: '/users' },
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
    </nav>
  );
}
