import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip'

import {
  LayoutDashboard,
  MonitorSmartphone,
  Clapperboard,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Layers3,
  ArrowLeft,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Devices', path: '/admin/devices', icon: MonitorSmartphone },
  { label: 'Templates', path: '/admin/templates', icon: Clapperboard },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
]

export default function AdminLayout() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <TooltipProvider delayDuration={200}>
      <div className="h-screen flex bg-background">
        {/* Sidebar */}
        <nav className={`h-full border-r bg-card flex flex-col transition-all duration-300 ${collapsed ? 'w-14' : 'w-56'}`}>
          {/* Logo */}
          <div className="h-12 flex items-center px-3 border-b shrink-0 gap-2.5">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Layers3 className="size-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-heading text-sm font-bold tracking-tight">
                Admin
              </motion.span>
            )}
          </div>

          {/* Back */}
          <div className="px-2 pt-2">
            <Link to="/">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size={collapsed ? 'icon-sm' : 'sm'} className={collapsed ? '' : 'w-full justify-start'}>
                    <ArrowLeft className="size-3.5" />
                    {!collapsed && 'Back to Studio'}
                  </Button>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">Back to Studio</TooltipContent>}
              </Tooltip>
            </Link>
          </div>

          <Separator className="mx-2 mt-2" />

          {/* Nav */}
          <div className="flex-1 px-2 py-2 space-y-0.5">
            {navItems.map((item) => {
              const isActive = item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path)

              return (
                <Link key={item.path} to={item.path}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        size={collapsed ? 'icon-sm' : 'sm'}
                        className={`
                          relative
                          ${collapsed ? '' : 'w-full justify-start'}
                          ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}
                        `}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="admin-active-indicator"
                            className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary rounded-full"
                          />
                        )}
                        <item.icon className="size-4" />
                        {!collapsed && item.label}
                      </Button>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>
                </Link>
              )
            })}
          </div>

          {/* Collapse */}
          <div className="px-2 py-2 border-t">
            <Button variant="ghost" size="icon-sm" className="w-full" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <PanelLeftOpen className="size-3.5" /> : <PanelLeftClose className="size-3.5" />}
            </Button>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  )
}
