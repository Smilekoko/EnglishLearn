import { Alert, Card, Col, Row, Statistic, Typography } from 'antd'
import { AudioOutlined, ReadOutlined, SoundOutlined, CloudServerOutlined } from '@ant-design/icons'
import { grammarRows, vowelRows } from '../mock/data.ts'

const { Title, Paragraph, Text } = Typography

const stats = [
  { title: '语法主题', value: grammarRows.length, icon: <ReadOutlined />, color: '#2f6fed' },
  { title: '元音', value: vowelRows.length, icon: <SoundOutlined />, color: '#13a37f' },
  {
    title: '发音音频',
    value: vowelRows.length,
    icon: <AudioOutlined />,
    color: '#d97706',
  },
  { title: '接口状态', value: '未接入', icon: <CloudServerOutlined />, color: '#8b5cf6' },
]

function Dashboard() {
  return (
    <div>
      <Title level={4} style={{ marginTop: 0 }}>
        概览
      </Title>
      <Paragraph type="secondary">
        当前数据来自前端 mock，仅用于界面演示。后端接口接入后会替换为真实数据。
      </Paragraph>

      <Row gutter={[16, 16]}>
        {stats.map((item) => (
          <Col key={item.title} xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={<span style={{ color: item.color, marginRight: 6 }}>{item.icon}</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Alert
        style={{ marginTop: 16 }}
        type="info"
        showIcon
        message="下一步"
        description={
          <span>
            后端（Spring Boot）尚未搭建，登录与数据均为前端演示。接入后：
            <Text code>POST /api/auth/login</Text> 登录、
            <Text code>GET /api/grammar</Text> 读取语法、
            <Text code>GET /api/vowels</Text> 读取音标。
          </span>
        }
      />
    </div>
  )
}

export default Dashboard
