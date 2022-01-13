import dayjs from "dayjs"
import byteSize from "byte-size"
import { Descriptions } from "antd"

const Item = Descriptions.Item
export default ({ report, hideTitle = false }) => {
  if (!report) return null
  return (
    <Descriptions
      size="small"
      bordered
      title={hideTitle ? null : "测试报告"}
      column={3}
    >
      <Item label="名称">{report.requestName}</Item>
      <Item label="URL" span={2}>
        {report.url}
      </Item>
      <Item label="开始时间">
        {dayjs(report.start).format("YYYY-MM-DD HH:mm:ss")}
      </Item>
      <Item label="请求总次数">{report.requests.sent}</Item>
      <Item label="总耗时(秒)">{report.duration}</Item>
      <Item label="错误次数">{report.errors}</Item>
      <Item label="超时次数">{report.timeouts}</Item>
      <Item label="错配次数">{report.mismatches}</Item>
      <Item label="平均响应(毫秒)">{report.latency.average}</Item>
      <Item label="平均每秒请求数">{report.requests.average}</Item>
      <Item label="平均吞吐量">
        {byteSize(report.throughput.average).toString()}
      </Item>

      <Item label="最小响应(毫秒)">{report.latency.min}</Item>
      <Item label="最小每秒请求数">{report.requests.min}</Item>
      <Item label="最小吞吐量">
        {byteSize(report.throughput.min).toString()}
      </Item>

      <Item label="最大响应(毫秒)">{report.latency.max}</Item>
      <Item label="最大每秒请求数">{report.requests.max}</Item>
      <Item label="最大吞吐量">
        {byteSize(report.throughput.max).toString()}
      </Item>
    </Descriptions>
  )
}
