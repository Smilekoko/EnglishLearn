import { Alert, Button, Card, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import { grammarRows, type GrammarRow } from '../mock/data.ts'

const { Text } = Typography

const levelColors: Record<string, string> = {
  入门: 'green',
  基础: 'blue',
  进阶: 'orange',
  提高: 'red',
}

const columns: ColumnsType<GrammarRow> = [
  {
    title: '主题',
    dataIndex: 'title',
    render: (_, row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.title}</div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {row.en}
        </Text>
      </div>
    ),
  },
  {
    title: '难度',
    dataIndex: 'level',
    width: 100,
    render: (level: string) => <Tag color={levelColors[level] ?? 'default'}>{level}</Tag>,
  },
  { title: '例句', dataIndex: 'examples', width: 90, render: (n: number) => `${n} 条` },
  {
    title: '操作',
    key: 'actions',
    width: 140,
    render: () => (
      <Button type="link" size="small" disabled>
        编辑
      </Button>
    ),
  },
]

function GrammarAdmin() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>语法管理</h3>
        <Button type="primary" icon={<PlusOutlined />} disabled>
          新增主题
        </Button>
      </div>

      <Alert
        style={{ margin: '16px 0' }}
        type="warning"
        showIcon
        message="演示数据"
        description="表格内容为前端 mock，编辑与新增按钮待后端接口接入后启用。"
      />

      <Card styles={{ body: { padding: 0 } }}>
        <Table<GrammarRow>
          rowKey="key"
          columns={columns}
          dataSource={grammarRows}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  )
}

export default GrammarAdmin
