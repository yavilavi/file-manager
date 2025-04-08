import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';
import classes from './UserButton.module.css';
import authStore from '../../stores/auth.store.ts';

export function UserButton() {
  const user = authStore((state) => state.user);
  return (
    <>
      {user && (
        <UnstyledButton className={classes.user}>
          <Group>
            <Avatar
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
              radius="xl"
            />

            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {user.name}
              </Text>

              <Text c="dimmed" size="xs">
                {user.email}
              </Text>
            </div>
          </Group>
        </UnstyledButton>
      )}
    </>
  );
}
