import { useCallback, useEffect, useState } from 'react'
import { App as AntdApp, Avatar, Button, Card, Input, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { fetchUsers, updateUserStatus, type AdminUserRow } from '../api/users.ts'

function formatTime(value: string): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('zh-CN', { hour12: false })
}

function UsersAdmin() {
  const { message } = AntdApp.useApp()
  const [rows, setRows] = useState<AdminUserRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(20)
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true)
      try {
        const data = await fetchUsers({ q: keyword, page, size }, signal)
        if (signal?.aborted) return
        setRows(data.items)
        setTotal(data.total)
        setError(null)
      } catch (err) {
        if (signal?.aborted) return
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        if (!signal?.aborted) setLoading(false)
      }
    },
    [keyword, page, size],
  )

  useEffect(() => {
    const controller = new AbortController()
    // 数据在 await 之后才落地，不会在渲染期同步触发重渲染
    // eslint-disable-next-line react/set-state-in-effect
    void load(controller.signal)
    return () => controller.abort()
  }, [load])

  const toggleStatus = async (row: AdminUserRow) => {
    const next = row.status === 'BANNED' ? 'ACTIVE' : 'BANNED'
    try {
      const updated = await updateUserStatus(row.id, next)
      setRows((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      message.success(next === 'BANNED' ? '已封禁' : '已解封')
    } catch (err) {
      message.error(err instanceof Error ? err.message : '操作失败')
    }
  }

  const columns: ColumnsType<AdminUserRow> = [
    {
      title: '用户',
      dataIndex: 'nickname',
      render: (_, row) => (
        <Space>
          <Avatar size={28} src={row.avatar || undefined}>
            {row.nickname.slice(0, 1)}
          </Avatar>
          <span>
            {row.nickname}
            <Typography.Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
              #{row.id}
            </Typography.Text>
          </span>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 100,
      render: (role: string) =>
        role === 'ADMIN' ? <Tag color="gold">管理员</Tag> : <Tag>普通用户</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) =>
        status === 'BANNED' ? <Tag color="red">已封禁</Tag> : <Tag color="green">正常</Tag>,
    },
    {
      title: '登录方式',
      dataIndex: 'provider',
      width: 180,
      render: (_, row) => (
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {row.provider || '—'}
          {row.subject ? ` · ${row.subject}` : ''}
        </Typography.Text>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (value: string) => formatTime(value),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginAt',
      width: 180,
      render: (value: string) => formatTime(value),
    },
    {
      title: '操作',
      key: 'action',
      width: 110,
      render: (_, row) => (
        <Button
          danger={row.status !== 'BANNED'}
          size="small"
          onClick={() => void toggleStatus(row)}
        >
          {row.status === 'BANNED' ? '解封' : '封禁'}
        </Button>
      ),
    },
  ]

  return (
    <Card
      title="用户管理"
      extra={
        <Input.Search
          allowClear
          placeholder="按昵称搜索"
          style={{ width: 240 }}
          onSearch={(value) => {
            setKeyword(value.trim())
            setPage(1)
          }}
        />
      }
    >
      {error && (
        <Typography.Text type="danger" style={{ display: 'block', marginBottom: 12 }}>
          {error}
        </Typography.Text>
      )}

      <Table<AdminUserRow>
        rowKey="id"
        size="middle"
        loading={loading}
        columns={columns}
        dataSource={rows}
        scroll={{ x: 900 }}
        pagination={{
          current: page,
          pageSize: size,
          total,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
          showTotal: (count) => `共 ${count} 个用户`,
          onChange: (nextPage, nextSize) => {
            setPage(nextPage)
            setSize(nextSize)
          },
        }}
      />
    </Card>
  )
}

export default UsersAdmin
