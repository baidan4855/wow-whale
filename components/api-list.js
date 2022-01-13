import dynamic from "next/dynamic"

import React, { useState, useEffect } from "react"
import {
  Button,
  message,
  Table,
  Card,
  Input,
  Descriptions,
  Row,
  Col,
} from "antd"
import {
  UploadOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons"
import _ from "lodash"
import axios from "axios"
import dayjs from "dayjs"

const JsonView = dynamic(() => import("react-json-view"), { ssr: false })

const Management = ({ value, onChange }) => {
  const [data, setData] = useState(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState(value)
  const [name, setName] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, size: 10 })
  const fetchData = async () => {
    const params = { ...pagination }
    if (name) {
      params.name = name
    }
    const result = await axios.get("/api/request-list", {
      params,
    })
    if (result.data.status === "ok") {
      setData(result.data.result)
    }
  }
  useEffect(() => {
    fetchData()
  }, [pagination])
  const onSelectRow = (keys) => {
    setSelectedRowKeys(keys)
    onChange(keys)
  }
  return (
    <Table
      dataSource={_.get(data, "requests")}
      rowKey={(row) => row.hash}
      rowSelection={{
        type: "checkbox",
        onChange: (keys) => {
          onSelectRow(keys)
        },
        selectedRowKeys,
      }}
      size="small"
      style={{ width: "100%" }}
      pagination={{
        pageSize: pagination.size,
        current: pagination.page,
        onChange: (page, size) => setPagination({ page, size }),
        total: _.get(data, "total"),
      }}
      columns={[
        {
          title: "类型",
          dataIndex: "method",
          width: 50,
        },
        {
          title: "名称",
          dataIndex: "name",
        },

        {
          title: "描述",
          render: (record) => {
            return record.desc || record.name
          },
        },
        {
          title: "入库时间",
          dataIndex: "createdAt",
          render: (date) => dayjs(date).format("YYYY-MM-DD"),
        },
      ]}
      expandable={{
        expandedRowRender: (req) => {
          return (
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="url">{req.url}</Descriptions.Item>
              <Descriptions.Item label="header">
                <JsonView
                  src={req.header}
                  theme="monokai"
                  displayDataTypes={false}
                  enableClipboard={false}
                />
              </Descriptions.Item>
              <Descriptions.Item label="body">{req.body}</Descriptions.Item>
            </Descriptions>
          )
        },
      }}
    />
  )
}

export default Management
