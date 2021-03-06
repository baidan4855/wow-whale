import { useRouter } from "next/router"
import { Layout, Menu } from "antd"
import {
  CloudUploadOutlined,
  FieldTimeOutlined,
  ApiOutlined,
} from "@ant-design/icons"
import "antd/dist/antd.dark.css"

const { Header, Content, Footer, Sider } = Layout

const AppLayout = ({ Component, pageProps }) => {
  const router = useRouter()
  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ fontSize: 18 }}>
        <span>通用Http性能测试工具</span>
      </Header>
      <Layout>
        <Sider with={200}>
          <Menu
            mode="inline"
            onClick={(e) => router.push(e.key)}
            defaultSelectedKeys={[router.pathname]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
          >
            <Menu.Item icon={<CloudUploadOutlined />} key="/upload-postman-log">
              解析Postman记录
            </Menu.Item>
            {/* <Menu.Item icon={<ApiOutlined />} key="/api-mgr">
              API管理
            </Menu.Item> */}
            <Menu.Item icon={<FieldTimeOutlined />} key="/task-mgr">
              任务管理
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Component {...pageProps} />
          </Content>
        </Layout>
      </Layout>
      <Footer style={{ color: "#b1b1b1", backgroundColor: "#1f1f1f" }}>
        <div style={{ textAlign: "center" }}>iHealth 共同照护</div>
      </Footer>
    </Layout>
  )
}

export default AppLayout
