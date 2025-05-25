/**
 * File Manager - Logoutbutton
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { IconLogout } from '@tabler/icons-react';
import classes from './Navbar.module.css';
import authStore from '../../stores/auth.store.ts';

function LogoutButton() {
  const logout = authStore((state) => state.logout);

  return (
    <div className={classes.logoutButton} onClick={logout}>
      <IconLogout size={20} stroke={1.5} className={classes.mainLinkIcon} />
      <span>Cerrar sesión</span>
    </div>
  );
}

export default LogoutButton;
