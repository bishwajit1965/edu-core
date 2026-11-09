// import { useApiQuery } from "../../hooks/useApiQuery.js";

const Test = () => {
  // const { data, isLoading, isError, error, isFetching, refetch } = useApiQuery({
  //   queryKey: ["query-test-notices"],
  //   url: "/notices/public",
  //   staleTime: 60 * 1000,
  // });

  // if (isLoading) return <p>Loading notices...</p>;

  // if (isError) {
  //   return <p>Error: {(error as Error).message}</p>;
  // }

  return (
    <div>
      <h2>TanStack Query Test</h2>

      {/* <p>Notices fetched: {Array.isArray(data) ? data.length : 0}</p> */}
      {/*
      <p>{isFetching ? "Fetching..." : "Data is idle"}</p>

      <button onClick={() => refetch()}>Refetch Notices</button>

      <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
};

export default Test;
