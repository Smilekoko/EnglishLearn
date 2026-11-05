import { useEffect, useState } from 'react'
import { App as AntdApp, Button, Form, Input } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { isLoggedIn, login } from '../auth.ts'
import styles from './Login.module.css'

interface LoginValues {
  username: string
  password: string
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { message } = AntdApp.useApp()
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? '/'

  useEffect(() => {
    if (isLoggedIn()) navigate('/', { replace: true })
  }, [navigate])

  const onFinish = async (values: LoginValues) => {
    setSubmitting(true)
    const ok = await login(values.username, values.password)
    setSubmitting(false)

    if (!ok) {
      message.error('用户名或密码错误')
      return
    }

    message.success('登录成功')
    navigate(from, { replace: true })
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            EL
          </span>
          <div>
            <div className={styles.title}>EnglishLearn</div>
            <div className={styles.subtitle}>管理后台</div>
          </div>
        </div>

        <Form<LoginValues>
          layout="vertical"
          size="large"
          initialValues={{ username: 'admin', password: '123456' }}
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={submitting}>
            登录
          </Button>
        </Form>

        <p className={styles.hint}>
          演示账号：<code>admin</code> / <code>123456</code>
          <br />
          后端接入后改为接口登录，此提示会移除。
        </p>
      </div>
    </div>
  )
}

export default Login
