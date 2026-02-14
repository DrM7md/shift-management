import { createTheme, ThemeOptions } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
    palette: {
        mode,
        ...(mode === 'dark'
            ? {
                primary: {
                    main: '#6366f1',
                    dark: '#4f46e5',
                    light: '#818cf8',
                },
                secondary: {
                    main: '#64748b',
                },
                success: {
                    main: '#10b981',
                },
                warning: {
                    main: '#f59e0b',
                },
                error: {
                    main: '#ef4444',
                },
                info: {
                    main: '#06b6d4',
                },
                background: {
                    default: '#0f172a',
                    paper: '#1e293b',
                },
                text: {
                    primary: '#f8fafc',
                    secondary: '#94a3b8',
                },
                divider: '#334155',
            }
            : {
                primary: {
                    main: '#6366f1',
                    dark: '#4f46e5',
                    light: '#818cf8',
                },
                secondary: {
                    main: '#64748b',
                },
                success: {
                    main: '#10b981',
                },
                warning: {
                    main: '#f59e0b',
                },
                error: {
                    main: '#ef4444',
                },
                info: {
                    main: '#06b6d4',
                },
                background: {
                    default: '#f8fafc',
                    paper: '#ffffff',
                },
                text: {
                    primary: '#1e293b',
                    secondary: '#64748b',
                },
                divider: '#e2e8f0',
            }),
    },
    typography: {
        fontFamily: 'Tajawal, sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 12,
                    padding: '10px 24px',
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                        boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: mode === 'dark' 
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
                        : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
                    border: mode === 'light' ? '1px solid #e2e8f0' : 'none',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-head': {
                        backgroundColor: mode === 'dark' ? '#1e293b' : '#f1f5f9',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: mode === 'dark' ? '#e2e8f0' : '#475569',
                        borderBottom: mode === 'dark' ? '2px solid #334155' : '2px solid #e2e8f0',
                        padding: '14px 16px',
                    },
                },
            },
        },
        MuiTableBody: {
            styleOverrides: {
                root: {
                    '& .MuiTableRow-root': {
                        '&:hover': {
                            backgroundColor: mode === 'dark' ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.04)',
                        },
                    },
                    '& .MuiTableCell-body': {
                        borderBottom: mode === 'dark' ? '1px solid #334155' : '1px solid #f1f5f9',
                        padding: '12px 16px',
                    },
                },
            },
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: mode === 'light' ? '1px solid #e2e8f0' : 'none',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    fontWeight: 500,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderLeft: 'none',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: mode === 'dark' ? '#1e293b' : '#ffffff',
                    borderBottom: mode === 'light' ? '1px solid #e2e8f0' : 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                },
            },
        },
    },
});

export const createAppTheme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));

export default createAppTheme;
