import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const Pagination = () => {
  const [page, setpage] = useState(1);
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["footballers", page],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:4000/footballers/?_limit=4&_page=${page}`,
      );
      return response.data;
    },
  });

  if (isLoading) return <h1>loading...</h1>;
  if (isError) return <h1>{error.message}</h1>;

  return (
    <div>
      {data.map((post) => (
        <div key={post.id}>
          <h2>{post.name}</h2>
        </div>
      ))}
      <button disabled={page === 1} onClick={() => setpage((prev) => prev - 1)}>
        prev
      </button>
      <p> page {page}</p>
      <button onClick={() => setpage((prev) => prev + 1)}>next</button>
    </div>
  );
};

export default Pagination;
