import React, { useState } from "react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:4000/footballers";

const getpost = async () => {
  const response = await axios.get(API);
  return response.data;
};

const postposts = async (post) => {
  const response = await axios.post(API, post);
  return response.data;
};

const editpost = async ({ id, name, country }) => {
  const response = await axios.put(`${API}/${id}`, {
    id,
    name,
    country,
  });

  return response.data;
};

const patchPost = async ({ id, country }) => {
  const response = await axios.patch(`${API}/${id}`, {
    country,
  });
  return response.data;
};

const deletePost = async (id) => {
  const response = await axios.delete(`${API}/${id}`);
  return response.data;
};

const PostsRQ = () => {
  const [title, settitle] = useState("");
  const [body, setbody] = useState("");
  const [editingid, seteditingid] = useState(null);

  const queryclient = useQueryClient();

  //get query

  const { data, error, isError, isLoading, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: getpost,
  });

  //add query

  const { mutate: addpost } = useMutation({
    mutationFn: postposts,
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["posts"],
      });
      settitle("");
      setbody("");
    },
  });

  //update query
  const { mutate: updatepost } = useMutation({
    mutationFn: editpost,
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["posts"],
      });
      settitle("");
      setbody("");
    },
  });

  //patch query

  const { mutate: patchpost } = useMutation({
    mutationFn: patchPost,
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  //delete query
  const { mutate: deletepost } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  // handler functions

  function handlesubmit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    if (editingid !== null) {
      updatepost({
        id: editingid,
        name: title,
        country: body,
      });
    } else {
      addpost({
        name: title,
        country: body,
      });
    }
  }

  function handleedit(post) {
    seteditingid(post.id);
    settitle(post.name);
    setbody(post.country);
  }

  function handlepatch(post) {
    const newcountry = prompt("enter new country", post.country);
    if (newcountry === null || !newcountry.trim()) return;

    patchpost({
      id: post.id,
      country: newcountry,
    });
  }

  function handledelete(id) {
    if (window.confirm("delete this footbaler")) {
      deletepost(id);
    }
  }

  if (isLoading) {
    return <h1>loading hudaixa...</h1>;
  }

  if (isError) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <div>
      <form onSubmit={handlesubmit}>
        <input
          type="text"
          placeholder="enter player name"
          value={title}
          onChange={(e) => settitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="enter player country"
          value={body}
          onChange={(e) => setbody(e.target.value)}
        />

        <button>save</button>

        <div className="players">
          {data.map((post) => (
            <div className="player" key={post.id}>
              <Link to={`rq-posts/${post.id}`}>
                <h2>{post.name}</h2>
                <h2>{post.country}</h2>
              </Link>

              <button type="button" onClick={() => handleedit(post)}>
                edit
              </button>
              <button type="button" onClick={() => handlepatch(post)}>
                patch
              </button>
              <button type="button" onClick={() => handledelete(post.id)}>
                delete
              </button>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default PostsRQ;
