import Layout from "../../../../../components/Layout";
import SidebarLayout from "../../../../../components/SidebarLayout";
import EnvSettings from "../../../../../components/env/EnvSettings";
import type { NextPageWithLayout } from "../../../../_app";

interface envProps {}

const Env: NextPageWithLayout<envProps> = ({}) => {
  return <EnvSettings />;
};

Env.getLayout = (page) => (
  <Layout>
    <SidebarLayout>{page}</SidebarLayout>
  </Layout>
);

export default Env;
