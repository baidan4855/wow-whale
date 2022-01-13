import { Layout, Menu } from "antd"
import { CloudUploadOutlined, FieldTimeOutlined } from "@ant-design/icons"
import "antd/dist/antd.dark.css"

const { Header, Content, Footer, Sider } = Layout

const AppLayout = ({ Component, pageProps }) => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ fontSize: 18 }}>
        <span>通用Http性能测试工具</span>
      </Header>
      <Layout>
        <Sider with={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["api-management"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
          >
            <Menu.Item icon={<CloudUploadOutlined />} key="api-management">
              API管理
            </Menu.Item>
            <Menu.Item icon={<FieldTimeOutlined />} key="task-management">
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
      <Footer style={{ color: "white" }}>
        <div style={{ textAlign: "center" }}>iHealth 共同照护</div>
      </Footer>
    </Layout>
  )
}

export default AppLayout
