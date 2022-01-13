import dynamic from "next/dynamic"
import { useState } from "react"
import { Form, Button, InputNumber, Row, Col, Spin } from "antd"
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons"
import axios from "axios"

const APIList = dynamic(() => import("components/api-list"))

const DEFAULT_CONFIG = {
  workers: 2,
  connections: 100,
  pipelining: 8,
  duration: 30,
  requests: [],
}
export default ({ onCancel, onSuccess }) => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const save = async (task) => {
    setSaving(true)

    const result = await axios.post("/api/save-task", {
      task,
    })
    if (result.data.status === "ok") {
      onSuccess && onSuccess()
    }
    setSaving(false)
  }
  return (
    <Spin spinning={saving}>
      <Form
        form={form}
        initialValues={DEFAULT_CONFIG}
        layout="vertical"
        onFinish={save}
      >
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item
              name="workers"
              label="线程数"
              rules={[{ required: true, message: "请设置线程数" }]}
            >
              <InputNumber min={1} max={10} precision={0} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="connections"
              label="并发数"
              rules={[{ required: true, message: "请设置并发数" }]}
            >
              <InputNumber min={1} max={1000} precision={0} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="pipelining"
              label="流水线数"
              rules={[{ required: true, message: "请设置流水线数" }]}
            >
              <InputNumber min={1} max={10} precision={0} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="duration"
              label="运行时长(秒)"
              rules={[{ required: true, message: "请设置运行时长" }]}
            >
              <InputNumber min={1} max={180} precision={0} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="requests"
          label="待测网址"
          rules={[{ required: true, message: "请勾选待测试的网址" }]}
        >
          <APIList />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            span: 16,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: 16 }}
            icon={saving ? <LoadingOutlined /> : <SaveOutlined />}
          >
            保存
          </Button>
          <Button htmlType="button" onClick={onCancel}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  )
}
