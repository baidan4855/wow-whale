import dynamic from "next/dynamic"
import dayjs from "dayjs"
import React, { useState, useEffect } from "react"
import { Button, message, Table, Card, Row, Col, Drawer } from "antd"
import { ReloadOutlined } from "@ant-design/icons"
import _ from "lodash"
import axios from "axios"
import { TASK_STATUS } from "modules/task-manager/constants"

const TaskAdder = dynamic(() => import("components/task-adder"), { ssr: false })
const ReportView = dynamic(() => import("components/report-list"), {
  ssr: false,
})

const TaskManagement = () => {
  const [creating, setCreating] = useState(false)
  const [data, setData] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, size: 10 })
  const fetchData = async () => {
    const params = { ...pagination }

    const result = await axios.get("/api/task-list", {
      params,
    })
    if (result.data.status === "ok") {
      setData(result.data.result)
    }
  }
  useEffect(() => {
    fetchData()
  }, [pagination])
  return (
    <Card
      title="任务管理"
      size="small"
      extra={
        <Row gutter={10}>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={fetchData} />
          </Col>
          <Col>
            <Button type="primary" onClick={() => setCreating(true)}>
              创建任务
            </Button>
          </Col>
        </Row>
      }
    >
      <Table
        dataSource={_.get(data, "tasks")}
        rowKey={(row) => row._id}
        pagination={{
          pageSize: pagination.size,
          current: pagination.page,
          onChange: (page, size) => setPagination({ page, size }),
          total: _.get(data, "total"),
        }}
        size="small"
        style={{ width: "100%" }}
        columns={[
          {
            title: "子任务数",
            dataIndex: "requests",
            align: "center",
            render: (reqs) => reqs.length,
          },
          {
            title: "线程数",
            dataIndex: "workers",
            align: "center",
          },
          {
            title: "并发数",
            dataIndex: "connections",
            align: "center",
          },
          {
            title: "流水线数",
            dataIndex: "pipelining",
            align: "center",
          },
          {
            title: "运行时长(秒)",
            dataIndex: "duration",
            align: "center",
          },
          {
            title: "任务状态",
            dataIndex: "status",
            align: "center",
            render: (status) => TASK_STATUS[status].text,
          },
          {
            title: "创建时间",
            dataIndex: "createdAt",
            width: 120,
            render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
          },
        ]}
        expandable={{
          expandedRowRender: (task) => {
            return <ReportView taskId={task._id} />
          },
        }}
      />
      <Drawer
        title="创建任务"
        visible={creating}
        width={1000}
        onClose={() => setCreating(false)}
        forceRender={false}
      >
        <TaskAdder
          onSuccess={() => {
            message.success(`创建测试任务成功`)
            setCreating(false)
          }}
          onCancel={() => setCreating(false)}
        />
      </Drawer>
    </Card>
  )
}

export default TaskManagement
