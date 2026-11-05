import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Avatar, Dropdown, Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  LogoutOutlined,
  ReadOutlined,
  SoundOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { logout, session } from '../auth.ts'
import styles from './AdminLayout.module.css'

const { Sider, Header, Content } = Layout

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '概览' },
  { key: 'grammar', icon: <ReadOutlined />, label: '语法管理' },
  { key: 'vowels', icon: <SoundOutlined />, label: '音标管理' },
]

const routes: Record<string, string> = {
  dashboard: '/',
  grammar: '/grammar',
  vowels: '/vowels',
}

const titles: Record<string, string> = {
  dashboard: '概览',
  grammar: '语法管理',
  vowels: '音标管理',
}

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = session()

  const activeKey = useMemo(() => {
    if (location.pathname.startsWith('/grammar')) return 'grammar'
    if (location.pathname.startsWith('/vowels')) return 'vowels'
    return 'dashboard'
  }, [location.pathname])

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Layout className={styles.layout}>
      <Sider width={220} theme="light" className={styles.sider}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            EL
          </span>
          <span className={styles.brandText}>管理后台</span>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          onClick={({ key }) => navigate(routes[key] ?? '/')}
          style={{ borderInlineEnd: 'none', paddingTop: 8 }}
        />
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerTitle}>{titles[activeKey]}</div>

          <Dropdown
            placement="bottomRight"
            menu={{
              items: [{ key: 'logout', icon: <LogoutOutlined />, label: '退出登录' }],
              onClick: ({ key }) => {
                if (key === 'logout') onLogout()
              },
            }}
          >
            <div className={styles.user}>
              <Avatar size={28} icon={<UserOutlined />} style={{ background: '#2f6fed' }} />
              <span className={styles.userName}>{user?.username ?? '未登录'}</span>
            </div>
          </Dropdown>
        </Header>

        <Content className={styles.content}>
          <div className={styles.inner}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
