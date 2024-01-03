import { getPublicSets } from "@/firebase/hooks";
import { useQuery } from "@tanstack/react-query";

const provideSets = (Component) => {
  const ProvideSets = (props) => {
    const { data, isLoading, isError } = useQuery({
      queryKey: ["publicSets"],
      queryFn: () => getPublicSets(),
    });

    if (isError) return <div>Error</div>;
    else if (isLoading) return <div>loading</div>;
    return <Component publicSets={data} {...props} />;
  };
  return ProvideSets;
};

export default provideSets;

