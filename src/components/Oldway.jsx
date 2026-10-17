import axios from "axios";
import React, { useEffect, useState } from "react";

const Oldway = () => {
  const [posts, setposts] = useState([]);
  const [error, seterror] = useState(false);
  const [loading, setloading] = useState(true);

  const fetchpost = async () => {
    try {
      const response = await axios.get("http://localhost:4000/footballers");
      setposts(response.data);
      console.log(setposts);
    } catch (e) {
      seterror(true);

      console.log(e);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchpost();
  }, []);

  if (loading) {
    return <h1>loading hudaixa...</h1>;
  }

  if (error) {
    return <h1>error has occured</h1>;
  }

  return (
    <div>
      {posts.map((post) => (
        <div>
          <h1>{post.name}</h1>
          <h1>{post.country}</h1>
        </div>
      ))}
    </div>
  );
};

export default Oldway;
