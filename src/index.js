import { Router } from '@vaadin/router';
import './components/employee-list.js';
import './components/employee-form.js';

window.addEventListener('load', () => {
  const outlet = document.getElementById('outlet');
  const router = new Router(outlet);

  router.setRoutes([
    { path: '/', redirect: '/list' },
    {
      path: '/list',
      component: 'employee-list',
      action: () => import('./components/employee-list.js')
    },
    {
      path: '/add',
      component: 'employee-form',
      action: () => import('./components/employee-form.js')
    },
    {
      path: '/edit/:id',
      component: 'employee-form',
      action: () => import('./components/employee-form.js')
    },
    { path: '(.*)', redirect: '/' }
  ]);
});