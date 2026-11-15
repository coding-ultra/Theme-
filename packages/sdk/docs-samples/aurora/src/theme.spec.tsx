import { afterEach, beforeAll, expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import { Button } from '@pterodactyl/sdk';
import { preloadTheme, renderView, renderWithTheme, type RenderedView } from '@pterodactyl/sdk/testing';
import theme from './theme';

const themes = [theme];
let rendered: RenderedView | undefined;

// Aurora's views are lazy; loading their chunks first lets renderView render them synchronously.
beforeAll(() => preloadTheme(themes));
afterEach(() => rendered?.unmount());

// #region tests
test('lays the dashboard out as cards with power buttons beside their links', () => {
    rendered = renderView('dashboard.serverList', { themes, fixture: 'servers' });

    const survival = screen.getByRole('link', { name: 'Survival' });

    expect(survival.getAttribute('href')).toBe('/server/a1b2c3d4');
    expect(survival.closest('li')?.textContent).toContain('Restart');
    expect(screen.getByRole('link', { name: 'Creative' }).closest('li')?.textContent).toContain('Start');
});

test('puts the power controls in the server header and asks before a kill', () => {
    rendered = renderView('layout.server', { themes, fixture: 'owner' });

    const header = screen.getByRole('heading', { name: 'Survival' }).closest('header');

    expect(header?.textContent).toContain('Restart');

    rendered = renderView('server.power', { themes, fixture: 'stopping' });
    expect(screen.getByRole('button', { name: 'Kill' }).hasAttribute('disabled')).toBe(false);
});

test('keeps the engine field attributes on the sign-in form', () => {
    rendered = renderView('page.auth.login', { themes, fixture: 'invalid' });

    const password = screen.getByLabelText('Password');

    expect(password.getAttribute('autocomplete')).toBe('current-password');
    expect(password.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Please enter your account password.')).not.toBeNull();
});

test('uses configured auth images and bundled defaults when unset', () => {
    const configWindow = window as Window & { SiteConfiguration?: unknown };
    const original = configWindow.SiteConfiguration;

    try {
        configWindow.SiteConfiguration = {
            theme: { settings: { logo: '/uploads/logo.svg', loginBackground: '/uploads/login.webp' } },
        };
        rendered = renderView('layout.auth', { themes });

        const section = rendered.container.querySelector('section')!;
        expect(section.querySelector('img[aria-hidden="true"]')?.getAttribute('src')).toBe('/uploads/login.webp');
        const logo = screen.getByRole('img', { name: 'Pterodactyl' });
        expect(logo.getAttribute('src')).toBe('/uploads/logo.svg');
        expect(logo.className).toContain('vizion-logo-float');

        rendered.unmount();
        configWindow.SiteConfiguration = { theme: { settings: {} } };
        rendered = renderView('layout.auth', { themes });

        const fallbackSection = rendered.container.querySelector('section')!;
        expect(fallbackSection.querySelector('img[aria-hidden="true"]')?.getAttribute('src')).toMatch(
            /^data:image\/svg\+xml/
        );
        expect(screen.getByRole('img', { name: 'Pterodactyl' }).getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    } finally {
        configWindow.SiteConfiguration = original;
    }
});

test('draws buttons as pills and keeps their state attributes', () => {
    rendered = renderWithTheme(<Button color='red'>Save</Button>, { themes });

    const button = rendered.container.querySelector('button');

    expect(button?.className).toContain('rounded-full');
    expect(button?.dataset).toMatchObject({ ui: 'button', part: 'root', color: 'red', size: 'small' });
});
// #endregion tests
