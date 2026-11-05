import { Alert, Button, Card, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlayCircleOutlined } from '@ant-design/icons'
import { vowelRows, type VowelRow } from '../mock/data.ts'

const { Text } = Typography

const columns: ColumnsType<VowelRow> = [
  {
    title: '音标',
    dataIndex: 'symbol',
    width: 100,
    render: (symbol: string) => (
      <span style={{ fontSize: 18, fontWeight: 500 }}>/{symbol}/</span>
    ),
  },
  {
    title: '分类',
    dataIndex: 'label',
    width: 130,
    render: (label: string) => <Tag>{label}</Tag>,
  },
  { title: '例词', dataIndex: 'word', width: 120 },
  {
    title: '音频文件',
    dataIndex: 'audio',
    render: (audio: string) => (
      <Text type="secondary" code>
        {audio}
      </Text>
    ),
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    render: () => (
      <Button type="link" size="small" icon={<PlayCircleOutlined />} disabled>
        试听
      </Button>
    ),
  },
]

function VowelsAdmin() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>音标管理</h3>
        <Button disabled>上传音频</Button>
      </div>

      <Alert
        style={{ margin: '16px 0' }}
        type="warning"
        showIcon
        message="演示数据"
        description="音标数据为前端 mock，试听与上传待后端接入后启用（音频目前在前端 webReact/public/audio）。"
      />

      <Card styles={{ body: { padding: 0 } }}>
        <Table<VowelRow>
          rowKey="key"
          columns={columns}
          dataSource={vowelRows}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          size="middle"
        />
      </Card>
    </div>
  )
}

export default VowelsAdmin
