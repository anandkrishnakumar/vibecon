'use client';

import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export default function Demo() {
  return (
    <MantineProvider>
    <Notifications />
    <Button
      onClick={() =>
        notifications.show({
          title: 'Default notification',
          message: 'Do not forget to star Mantine on GitHub! 🌟',
        })
      }
    >
      Show notification
    </Button>
    </MantineProvider>
  );
}