import { Link } from 'react-router-dom'
import { getAllDevices } from '../../devices/registry'
import { getAllTemplates } from '../../templates/registry'
import { Smartphone, Film, Plus, TrendingUp, Users, Download } from 'lucide-react'

export default function AdminDashboard() {
  const devices = getAllDevices()
  const templates = getAllTemplates()

  const stats = [
    { label: 'Total Devices', value: devices.length, icon: Smartphone, color: 'text-blue-400' },
    { label: 'Motion Templates', value: templates.length, icon: Film, color: 'text-purple-400' },
    { label: 'Total Exports', value: '—', icon: Download, color: 'text-green-400' },
    { label: 'Active Users', value: '—', icon: Users, color: 'text-amber-400' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-surface-400 mt-1">
          Manage devices, templates, and monitor usage.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-900 border border-surface-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <stat.icon size={20} className={stat.color} />
              <TrendingUp size={14} className="text-surface-600" />
            </div>
            <p className="text-2xl font-bold text-white mt-3">{stat.value}</p>
            <p className="text-xs text-surface-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/devices"
          className="bg-surface-900 border border-surface-800 rounded-xl p-6 hover:border-primary-500/30 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Plus size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">
                Create New Device
              </p>
              <p className="text-xs text-surface-400">
                Upload images and use AI to generate a Three.js component
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/templates"
          className="bg-surface-900 border border-surface-800 rounded-xl p-6 hover:border-primary-500/30 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Plus size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">
                Create Motion Template
              </p>
              <p className="text-xs text-surface-400">
                Design animations with AI assistance or manual code
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Device Library */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Device Library</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {devices.map((device) => (
            <div
              key={device.metadata.id}
              className="bg-surface-900 border border-surface-800 rounded-lg p-3"
            >
              <div className="w-full aspect-[3/4] bg-surface-800 rounded-md mb-2 flex items-center justify-center">
                <span className="text-3xl">
                  {device.metadata.category === 'phone' && '📱'}
                  {device.metadata.category === 'tablet' && '📱'}
                  {device.metadata.category === 'laptop' && '💻'}
                  {device.metadata.category === 'watch' && '⌚'}
                </span>
              </div>
              <p className="text-xs font-medium text-surface-200 truncate">{device.metadata.name}</p>
              <p className="text-[10px] text-surface-500">{device.metadata.brand}</p>
              <div className="flex gap-1 mt-1">
                {device.metadata.colors.map((c) => (
                  <div
                    key={c.hex}
                    className="w-2.5 h-2.5 rounded-full border border-surface-700"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Library */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Template Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-surface-900 border border-surface-800 rounded-lg p-4"
            >
              <p className="text-sm font-medium text-surface-200">{template.name}</p>
              <p className="text-xs text-surface-500 mt-1 line-clamp-2">{template.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-800 text-surface-400 border border-surface-700">
                  {template.category}
                </span>
                <span className="text-[10px] text-surface-500">{template.duration}s</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
