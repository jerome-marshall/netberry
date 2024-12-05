import Layout from "@/components/Layout";
import SidebarLayout from "@/components/SidebarLayout";

import CreateSiteCard from "@/components/CreateSiteCard";
import type { NextPageWithLayout } from "../_app";

const CreatePage: NextPageWithLayout = () => {
  return <CreateSiteCard />;
};

CreatePage.getLayout = (page) => (
  <Layout>
    <SidebarLayout chooseSidebar="admin">{page}</SidebarLayout>
  </Layout>
);

export default CreatePage;
