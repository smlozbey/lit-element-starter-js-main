import { expect } from '@open-wc/testing';
import { Router } from '@vaadin/router';

describe('App Routing', () => {
  let router;

  beforeEach(() => {
    const outlet = document.createElement('div');
    outlet.id = 'outlet';
    document.body.appendChild(outlet);

    router = new Router(outlet);
  });

  afterEach(() => {
    const outlet = document.getElementById('outlet');
    if (outlet) outlet.remove();
  });

  it('redirects from / to /list', async () => {
    window.history.pushState({}, '', '/');
    router.setRoutes([
      { path: '/', redirect: '/list' },
      { path: '/list', component: 'employee-list' },
    ]);

    await new Promise(resolve => setTimeout(resolve, 50));
    expect(window.location.pathname).to.equal('/list');
  });

  it('renders employee-list at /list', async () => {
    window.history.pushState({}, '', '/list');
    router.setRoutes([
      { path: '/list', component: 'employee-list' },
    ]);

    await new Promise(resolve => setTimeout(resolve, 50));
    const outlet = document.getElementById('outlet');
    expect(outlet.querySelector('employee-list')).to.exist;
  });

  it('renders employee-form at /add', async () => {
    window.history.pushState({}, '', '/add');
    router.setRoutes([
      { path: '/add', component: 'employee-form' },
    ]);

    await new Promise(resolve => setTimeout(resolve, 50));
    const outlet = document.getElementById('outlet');
    expect(outlet.querySelector('employee-form')).to.exist;
  });
});