import { RouteObject, useRoutes } from 'react-router-dom';

import { Root } from '../features/root.tsx';
import { AppLayout } from './app-layout.tsx';

const routes: RouteObject[] = [
    {
        children: [],
        element: <Root />,
        path: '/',
    },
];

export function App() {
    return <AppLayout>{useRoutes(routes)}</AppLayout>;
}
