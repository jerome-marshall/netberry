import clsx from "clsx";
import Card from "../Card";
import Shimmer from "../Shimmer";

const DeploysCardLoader = () => {
  return (
    <div className="mt-6">
      <Card title="Production Deploys" titleLink="">
        {Array(7)
          .fill(0)
          .map((_, i) => {
            return (
              <div
                key={"deployitem" + i.toString()}
                className={clsx(
                  "card-item group cursor-pointer justify-between gap-6"
                )}
              >
                <div className="">
                  <div className="flex gap-2">
                    <Shimmer className="h-4 w-[260px]" />
                  </div>
                  <Shimmer className="mt-2 h-3 w-[160px]" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end justify-center">
                    <Shimmer className=" h-4 w-[160px]" />
                    <Shimmer className="mt-2 h-4 w-[100px]" />
                  </div>
                </div>
              </div>
            );
          })}
      </Card>
    </div>
  );
};

export default DeploysCardLoader;
