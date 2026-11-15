// #region settings
import { Main, useThemeSettings, type ViewProps } from '@pterodactyl/sdk/theme';
import type { ThemeSettings } from '../theme-types';
// #endregion settings
import SchemeSwitch from '../SchemeSwitch';

const defaultLoginBackground = new URL('../assets/default-login-bg.svg', import.meta.url).href;
const defaultLogo = new URL('../assets/default-logo.svg', import.meta.url).href;

/**
 * A split screen: the brand on one side, the sign-in pages on the other. It imports nothing from
 * `@pterodactyl/sdk`, so the sign-in screen renders without loading the full SDK first.
 */
export default function AuthLayout({ model, children }: ViewProps<'layout.auth'>) {
    // #region settings
    const { tagline, logo, loginBackground } = useThemeSettings<ThemeSettings>();
    // #endregion settings

    return (
        <div className='relative grid min-h-dvh lg:grid-cols-2'>
            <div className='absolute inset-0 lg:hidden' aria-hidden='true'>
                <img src={loginBackground ?? defaultLoginBackground} alt='' className='h-full w-full object-cover' />
                <div className='absolute inset-0 bg-background/35' />
            </div>
            <section className='relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex'>
                <img
                    src={loginBackground ?? defaultLoginBackground}
                    alt=''
                    aria-hidden='true'
                    className='absolute inset-0 h-full w-full object-cover'
                />
                <div className='absolute inset-0 bg-background/35' aria-hidden='true' />
                <img
                    src={logo ?? model.brand.logoUrl ?? defaultLogo}
                    alt={model.brand.name}
                    className='vizion-logo-float relative z-10 h-10 w-auto self-start object-contain'
                />
                <p className='relative z-10 max-w-sm text-4xl leading-tight font-semibold text-balance'>{tagline}</p>
            </section>
            <div className='relative z-10 flex flex-col'>
                <div className='flex justify-end p-4'>
                    <SchemeSwitch />
                </div>
                <Main className='flex flex-1 items-center justify-center p-6'>
                    <div className='w-full max-w-sm'>{children}</div>
                </Main>
            </div>
        </div>
    );
}
