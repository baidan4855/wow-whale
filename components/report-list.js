import dynamic from "next/dynamic"

import { useState, useEffect } from "react"
import { Table, Modal, Button } from "antd"
import byteSize from "byte-size"

import axios from "axios"
import dayjs from "dayjs"

const Detail = dynamic(() => import("components/reportDetail"))

const ReportList = ({ taskId }) => {
  const [data, setData] = useState(null)
  const [report, setReport] = useState(null)

  const [pagination, setPagination] = useState({ page: 1, size: 10 })
  const fetchData = async () => {
    const params = { ...pagination }
    if (taskId) {
      params.taskId = taskId
    }
    const result = await axios.get("/api/report-list", {
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
    <>
      <Table
        dataSource={_.get(data, "reports")}
        bordered
        size="small"
        style={{ marginTop: 36, marginBottom: 36, marginRight: 36 }}
        pagination={
          _.get(data, "total") > 10
            ? {
                pageSize: pagination.size,
                current: pagination.page,
                onChange: (page, size) => setPagination({ page, size }),
                total: _.get(data, "total"),
              }
            : false
        }
        columns={[
          {
            title: "名称",
            dataIndex: "requestName",
            width: 240,
          },
          {
            title: "开始时间",
            dataIndex: "start",
            width: 180,
            render: (date) => dayjs(date).format("YYYY-MM-DD hh:mm:ss"),
          },
          // {
          //   title: "结束时间",
          //   dataIndex: "finish",
          //   render: (date) => dayjs(date).format("YYYY-MM-DD hh:mm:ss"),
          // },
          {
            title: "总耗时(秒)",
            dataIndex: "duration",
            width: 110,
          },
          {
            title: "总请求次数",
            width: 110,
            render: (v, row) => row.requests.sent,
          },
          {
            title: "平均吞吐量(QPS)",
            width: 100,
            render: (v, row) => row.requests.average,
          },
          {
            title: "平均耗时(毫秒)",
            width: 100,
            render: (v, row) => row.latency.average,
          },
          {
            title: "平均流量(BPS)",
            width: 100,
            render: (v, row) =>
              byteSize(row.throughput.average, { precision: 2 }).toString(),
          },
          {
            title: "详细报告",
            width: 100,
            render: (v, row) => (
              <Button type="link" onClick={() => setReport(row)}>
                查看
              </Button>
            ),
          },
        ]}
        // expandable={{
        //   expandedRowRender: (req) => {
        //     return (
        //       <Descriptions bordered column={1} size="small">
        //         <Descriptions.Item label="url">{req.url}</Descriptions.Item>
        //         <Descriptions.Item label="header">
        //           <JsonView
        //             src={req.header}
        //             theme="monokai"
        //             displayDataTypes={false}
        //             enableClipboard={false}
        //           />
        //         </Descriptions.Item>
        //         <Descriptions.Item label="body">{req.body}</Descriptions.Item>
        //       </Descriptions>
        //     )
        //   },
        // }}
      />
      <Modal
        visible={!!report}
        width={1000}
        title="测试报告"
        onCancel={() => setReport(null)}
        cancelText="关闭"
        okButtonProps={{ hidden: true }}
      >
        <Detail report={report} hideTitle={true} />
      </Modal>
    </>
  )
}

export default ReportList
