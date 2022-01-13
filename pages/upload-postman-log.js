import dynamic from "next/dynamic"

import React, { useState, useEffect, useRef } from "react"
import {
  Upload,
  Button,
  message,
  Table,
  Card,
  Input,
  Descriptions,
  Row,
  Col,
  Checkbox,
} from "antd"
import {
  UploadOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons"
import _ from "lodash"
import axios from "axios"

const JsonView = dynamic(() => import("react-json-view"), { ssr: false })

const PostmanHandler = () => {
  const [uploading, setUploading] = useState(false)
  const [requests, setRequests] = useState(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState(null)
  const [saving, setSaving] = useState(false)
  const updateRow = ({ value, dataIndex, index }) => {
    const _reqs = [...requests]
    _reqs[index][dataIndex] = value
    setRequests(_reqs)
  }
  const save = async () => {
    setSaving(true)
    const selectedRows = _.map(selectedRowKeys, (key) => requests[key])
    const result = await axios.post("/api/save-requests", {
      requests: selectedRows,
    })
    if (result.data.status === "ok") {
      message.success(`成功保存了${result.data.result}条请求信息。`)
      setRequests(null)
      setSelectedRowKeys(null)
    }
    setSaving(false)
  }
  return (
    <Card
      title="API信息提取和保存"
      size="small"
      extra={
        <Row gutter={10}>
          <Col>
            <Upload
              name="file"
              action="/api/upload"
              showUploadList={false}
              accept=".json"
              beforeUpload={(file) => {
                if (file.type !== "application/json") {
                  message.error(`请上传json文件`)
                  return Upload.LIST_IGNORE
                }
                setUploading(true)
                setRequests(null)
                return true
              }}
              onChange={(info) => {
                if (info.file.status === "done") {
                  if (_.get(info, "file.response.status") === "ok") {
                    message.success(`${info.file.name} 上传成功`)
                    setUploading(false)
                    setRequests(_.get(info, "file.response.result"))
                  } else {
                    message.error(`${info.file.name} 解析失败`)
                    setUploading(false)
                  }
                }
              }}
            >
              <Button
                icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
              >
                解析Postman记录
              </Button>
            </Upload>
          </Col>
          <Col>
            <Button
              icon={saving ? <LoadingOutlined /> : <SaveOutlined />}
              onClick={save}
              disabled={_.isEmpty(selectedRowKeys) || saving}
              type="primary"
            >
              保存选中的记录
            </Button>
          </Col>
        </Row>
      }
    >
      {_.isEmpty(requests) || (
        <Table
          dataSource={requests}
          loading={uploading}
          rowKey={(row, index) => index}
          pagination={false}
          rowSelection={{
            type: "checkbox",
            onChange: (keys) => {
              setSelectedRowKeys(keys)
            },
            getCheckboxProps: (row) => ({
              disabled: row.exists,
            }),
            selectedRowKeys,
          }}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          size="small"
          style={{ width: "100%" }}
          columns={[
            {
              title: "类型",
              dataIndex: "method",
              width: 50,
            },
            {
              title: "名称",
              dataIndex: "name",
              width: 350,
            },

            {
              title: "描述",
              render: (record) => {
                return record.desc || record.name
              },

              onCell: (record, index) => ({
                value: record.desc,
                dataIndex: "desc",
                index,
                record,
                editable: true,
                onBlur: updateRow,
              }),
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
      )}
    </Card>
  )
}

const EditableCell = ({
  value,
  editable,
  children,
  dataIndex,
  record,
  index,
  onBlur,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Input
        defaultValue={value}
        ref={inputRef}
        onBlur={(e) => {
          onBlur({ value: e.target.value, dataIndex, index })
          setEditing(false)
        }}
      />
    ) : (
      <div onClick={toggleEdit}>{children}</div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

export default PostmanHandler
