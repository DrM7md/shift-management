import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    useTheme,
    useMediaQuery,
    Tooltip,
    Avatar,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronRight as ChevronRightIcon,
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    CalendarMonth as CalendarIcon,
    AccountBalanceWallet as WalletIcon,
    EventBusy as LeaveIcon,
    Assessment as ReportIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    ExpandLess,
    ExpandMore,
    Schedule as ScheduleIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useThemeContext } from '@/Contexts/ThemeContext';

const drawerWidth = 260;
const drawerCollapsedWidth = 72;

interface MenuItem {
    title: string;
    icon: React.ReactNode;
    path: string;
    routeName: string;
    children?: MenuItem[];
}

const menuItems: MenuItem[] = [
    { title: 'لوحة التحكم', icon: <DashboardIcon />, path: '/dashboard', routeName: 'dashboard' },
    { title: 'الموظفين', icon: <PeopleIcon />, path: '/employees', routeName: 'employees.index' },
    { title: 'جدول المناوبات', icon: <CalendarIcon />, path: '/schedule', routeName: 'schedule.index' },
    { title: 'الأرصدة', icon: <WalletIcon />, path: '/balances', routeName: 'balances.index' },
    { title: 'الإجازات', icon: <LeaveIcon />, path: '/leaves', routeName: 'leaves.index' },
    { 
        title: 'التقارير', 
        icon: <ReportIcon />, 
        path: '/reports', 
        routeName: 'reports.index',
        children: [
            { title: 'التقرير الشهري', icon: <CalendarIcon />, path: '/reports?type=monthly', routeName: 'reports.monthly' },
            { title: 'تقرير الموظفين', icon: <PeopleIcon />, path: '/reports?type=employees', routeName: 'reports.employees' },
            { title: 'تقرير الأرصدة', icon: <WalletIcon />, path: '/reports?type=balances', routeName: 'reports.balances' },
        ]
    },
    { title: 'الإعدادات', icon: <SettingsIcon />, path: '/settings', routeName: 'settings.index' },
];

interface Props {
    children: React.ReactNode;
    title?: string;
}

export default function MainLayout({ children, title }: Props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { mode, toggleMode } = useThemeContext();
    const { url } = usePage();
    
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => {
        if (isMobile) {
            setMobileOpen(!mobileOpen);
        } else {
            setCollapsed(!collapsed);
        }
    };

    const handleSubmenuToggle = (title: string) => {
        setOpenSubmenu(openSubmenu === title ? null : title);
    };

    const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const isActive = (routeName: string) => {
        return url.startsWith('/' + routeName.split('.')[0]);
    };

    const currentWidth = collapsed && !isMobile ? drawerCollapsedWidth : drawerWidth;

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    p: 2,
                    minHeight: 64,
                }}
            >
                {!collapsed && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <ScheduleIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.light' }}>
                            نظام المناوبات
                        </Typography>
                    </Box>
                )}
                {collapsed && (
                    <ScheduleIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                )}
                {!isMobile && (
                    <IconButton onClick={handleDrawerToggle} size="small">
                        {collapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                )}
            </Box>
            
            <Divider />
            
            <List sx={{ flex: 1, px: 1, py: 2 }}>
                {menuItems.map((item) => (
                    <React.Fragment key={item.title}>
                        {item.children ? (
                            <>
                                <ListItem disablePadding sx={{ mb: 0.5 }}>
                                    <Tooltip title={collapsed ? item.title : ''} placement="right">
                                        <ListItemButton
                                            onClick={() => handleSubmenuToggle(item.title)}
                                            sx={{
                                                borderRadius: 2,
                                                minHeight: 48,
                                                justifyContent: collapsed ? 'center' : 'initial',
                                                px: collapsed ? 1 : 2,
                                                ...(isActive(item.routeName) && {
                                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%)',
                                                }),
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: collapsed ? 0 : 2,
                                                    justifyContent: 'center',
                                                    color: isActive(item.routeName) ? 'primary.main' : 'text.secondary',
                                                }}
                                            >
                                                {item.icon}
                                            </ListItemIcon>
                                            {!collapsed && (
                                                <>
                                                    <ListItemText 
                                                        primary={item.title} 
                                                        sx={{ 
                                                            '& .MuiTypography-root': { 
                                                                fontWeight: isActive(item.routeName) ? 600 : 400 
                                                            } 
                                                        }}
                                                    />
                                                    {openSubmenu === item.title ? <ExpandLess /> : <ExpandMore />}
                                                </>
                                            )}
                                        </ListItemButton>
                                    </Tooltip>
                                </ListItem>
                                {!collapsed && (
                                    <Collapse in={openSubmenu === item.title} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {item.children.map((child) => (
                                                <ListItem key={child.title} disablePadding sx={{ mb: 0.5 }}>
                                                    <ListItemButton
                                                        component={Link}
                                                        href={child.path}
                                                        sx={{
                                                            borderRadius: 2,
                                                            pr: 4,
                                                            minHeight: 40,
                                                        }}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                                                            {child.icon}
                                                        </ListItemIcon>
                                                        <ListItemText 
                                                            primary={child.title}
                                                            sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>
                                )}
                            </>
                        ) : (
                            <ListItem disablePadding sx={{ mb: 0.5 }}>
                                <Tooltip title={collapsed ? item.title : ''} placement="right">
                                    <ListItemButton
                                        component={Link}
                                        href={item.path}
                                        sx={{
                                            borderRadius: 2,
                                            minHeight: 48,
                                            justifyContent: collapsed ? 'center' : 'initial',
                                            px: collapsed ? 1 : 2,
                                            ...(isActive(item.routeName) && {
                                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                color: 'white',
                                                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                },
                                            }),
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: collapsed ? 0 : 2,
                                                justifyContent: 'center',
                                                color: isActive(item.routeName) ? 'white' : 'text.secondary',
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        {!collapsed && (
                                            <ListItemText 
                                                primary={item.title}
                                                sx={{ 
                                                    '& .MuiTypography-root': { 
                                                        fontWeight: isActive(item.routeName) ? 600 : 400 
                                                    } 
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </Tooltip>
                            </ListItem>
                        )}
                    </React.Fragment>
                ))}
            </List>
            
            <Divider />
            
            <Box sx={{ p: 2 }}>
                <Tooltip title={collapsed ? 'تسجيل الخروج' : ''} placement="right">
                    <ListItemButton
                        component={Link}
                        href="/logout"
                        method="post"
                        as="button"
                        sx={{
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'error.main',
                            color: 'error.main',
                            justifyContent: collapsed ? 'center' : 'initial',
                            '&:hover': {
                                bgcolor: 'error.main',
                                color: 'white',
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: collapsed ? 0 : 2,
                                justifyContent: 'center',
                                color: 'inherit',
                            }}
                        >
                            <LogoutIcon />
                        </ListItemIcon>
                        {!collapsed && <ListItemText primary="تسجيل الخروج" />}
                    </ListItemButton>
                </Tooltip>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${currentWidth}px)` },
                    mr: { md: `${currentWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1,
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ ml: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        {title || 'لوحة التحكم'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="تحديث">
                            <IconButton onClick={() => window.location.reload()}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={mode === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}>
                            <IconButton onClick={toggleMode}>
                                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                            </IconButton>
                        </Tooltip>
                        
                        <IconButton onClick={handleProfileMenu}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                م
                            </Avatar>
                        </IconButton>
                    </Box>
                    
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                        <MenuItem component={Link} href="/profile">الملف الشخصي</MenuItem>
                        <MenuItem component={Link} href="/settings">الإعدادات</MenuItem>
                        <Divider />
                        <MenuItem component={Link} href="/logout" method="post" as="button">
                            تسجيل الخروج
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            
            <Box
                component="nav"
                sx={{ width: { md: currentWidth }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    anchor="right"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            bgcolor: 'background.paper',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                
                <Drawer
                    variant="permanent"
                    anchor="right"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: currentWidth,
                            bgcolor: 'background.paper',
                            borderLeft: 1,
                            borderColor: 'divider',
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${currentWidth}px)` },
                    mt: '64px',
                    bgcolor: 'background.default',
                    minHeight: 'calc(100vh - 64px)',
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
