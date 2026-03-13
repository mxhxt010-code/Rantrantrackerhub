import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { RantPortal } from './components/pages/RantPortal';
import { RantrackerEcosystem } from './components/pages/RantrackerEcosystem';
import { DeviceDeepDive } from './components/pages/DeviceDeepDive';
import { PulsePage } from './components/pages/PulsePage';
import { DashboardPage } from './components/pages/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: RantPortal },
      { path: 'devices', Component: RantrackerEcosystem },
      { path: 'deep-dive', Component: DeviceDeepDive },
      { path: 'pulse-map', Component: PulsePage },
      { path: 'dashboard', Component: DashboardPage },
    ],
  },
]);
