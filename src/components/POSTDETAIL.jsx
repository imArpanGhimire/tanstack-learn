import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";

const POSTDETAIL = () => {
  const { id } = useParams();
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:4000/footballers/${id}`,
      );
      return response.data;
    },
  });

  if (isLoading) return <h1>loading...</h1>;
  if (isError) return <h1>{error.message}</h1>;
  const { name, country } = data;
  return (
    <div className="player player-detail">
      <h2>{name}</h2>
      <p>{country}</p>
    </div>
  );
};

export default POSTDETAIL;
