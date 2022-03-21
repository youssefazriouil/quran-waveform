import { createReactQueryHooks } from '@trpc/react';
import { AppRouter } from 'backend/router/routes';

export const trpc = createReactQueryHooks<AppRouter>();
