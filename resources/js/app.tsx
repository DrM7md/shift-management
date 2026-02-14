import '../css/app.css';
import './bootstrap';
import '@fontsource/tajawal/300.css';
import '@fontsource/tajawal/400.css';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ThemeContextProvider, useThemeContext } from '@/Contexts/ThemeContext';
import { createAppTheme } from '@/theme';

const appName = 'نظام المناوبات';

function ThemedApp({ App, props }: { App: any; props: any }) {
    const { mode } = useThemeContext();
    const theme = createAppTheme(mode);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App {...props} />
        </ThemeProvider>
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeContextProvider>
                <ThemedApp App={App} props={props} />
            </ThemeContextProvider>
        );
    },
    progress: {
        color: '#6366f1',
    },
});
