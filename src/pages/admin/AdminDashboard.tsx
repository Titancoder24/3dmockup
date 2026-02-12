import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAllDevices } from '../../devices/registry'
import { getAllTemplates } from '../../templates/registry'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'

import {
  MonitorSmartphone,
  Clapperboard,
  TrendingUp,
  Activity,
  ArrowRight,
  Plus,
  Zap,
  Clock,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
} from 'lucide-react'

export default function AdminDashboard() {
  const devices = getAllDevices()
  const templates = getAllTemplates()

  const stats = [
    { label: 'Devices', value: devices.length, icon: MonitorSmartphone, color: 'text-primary' },
    { label: 'Templates', value: templates.length, icon: Clapperboard, color: 'text-accent-500' },
    { label: 'Exports', value: '—', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Active', value: '1', icon: Activity, color: 'text-blue-500' },
  ]

  const fadeUp = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your mockup studio</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <Card className="py-5 gap-3">
              <CardContent className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="font-heading text-2xl font-extrabold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/devices">
          <Card className="py-5 gap-0 group cursor-pointer hover:border-primary/30 transition-colors">
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-bold">Create Device</p>
                  <p className="text-xs text-muted-foreground">AI-powered device architect</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/templates">
          <Card className="py-5 gap-0 group cursor-pointer hover:border-accent-500/30 transition-colors">
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
                  <Zap className="size-5 text-accent-500" />
                </div>
                <div>
                  <p className="font-heading font-bold">Create Template</p>
                  <p className="text-xs text-muted-foreground">Design motion sequences</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground group-hover:text-accent-500 group-hover:translate-x-0.5 transition-all" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Content Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Devices */}
        <Card className="gap-0 py-0">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-sm font-heading font-bold">Device Library</CardTitle>
            <div className="col-start-2 row-span-2 row-start-1 self-center">
              <Link to="/admin/devices">
                <Button variant="link" size="sm" className="text-xs">View all →</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {devices.slice(0, 5).map((device, i) => (
              <div key={device.metadata.id}>
                <div className="flex items-center gap-3 px-6 py-3 hover:bg-secondary/30 transition-colors">
                  <div className="size-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    {device.metadata.category === 'phone' && <Smartphone className="size-4 text-muted-foreground" />}
                    {device.metadata.category === 'tablet' && <Tablet className="size-4 text-muted-foreground" />}
                    {device.metadata.category === 'laptop' && <Laptop className="size-4 text-muted-foreground" />}
                    {device.metadata.category === 'watch' && <Watch className="size-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{device.metadata.name}</p>
                    <p className="text-[10px] text-muted-foreground">{device.metadata.brand}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {device.metadata.colors.slice(0, 3).map((c) => (
                      <div key={c.hex} className="size-2.5 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                </div>
                {i < devices.slice(0, 5).length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Templates */}
        <Card className="gap-0 py-0">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-sm font-heading font-bold">Motion Templates</CardTitle>
            <div className="col-start-2 row-span-2 row-start-1 self-center">
              <Link to="/admin/templates">
                <Button variant="link" size="sm" className="text-xs">View all →</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {templates.slice(0, 5).map((tpl, i) => (
              <div key={tpl.id}>
                <div className="flex items-center gap-3 px-6 py-3 hover:bg-secondary/30 transition-colors">
                  <div className="size-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Clapperboard className="size-4 text-accent-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tpl.name}</p>
                    <p className="text-[10px] text-muted-foreground">{tpl.category}</p>
                  </div>
                  <Badge variant="secondary" className="text-[9px] font-mono py-0 shrink-0">
                    <Clock className="size-2.5" />
                    {tpl.duration}s
                  </Badge>
                </div>
                {i < templates.slice(0, 5).length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
