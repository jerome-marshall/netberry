import { type NextPage } from "next";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data } = api.site.getAll.useQuery();
  const { data: deployData } = api.deploy.getAll.useQuery({
    site_id: "2bd5802f-0bf8-4011-b843-e4871da09e49",
  });
  console.log("🚀 ~ file: index.tsx:6 ~ data", deployData);
  return (
    <div>
      <h1>Welcome to NetBerry</h1>
      <div className="">
        <h2 className="">Sites</h2>
        <div className="sites">
          {data?.map((site) => (
            <p key={site.site_id}>{site.name}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
