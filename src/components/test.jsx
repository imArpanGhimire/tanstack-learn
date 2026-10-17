// gpt code

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:4000/footballers";

// GET
const getposts = async () => {
  const response = await axios.get(API);
  return response.data;
};

// POST
const postposts = async (post) => {
  const response = await axios.post(API, post);
  return response.data;
};

// PUT
const putposts = async ({ id, name, country }) => {
  const response = await axios.put(`${API}/${id}`, {
    name,
    country,
  });
  return response.data;
};

// PATCH
const patchposts = async ({ id, country }) => {
  const response = await axios.patch(`${API}/${id}`, {
    country,
  });
  return response.data;
};

// DELETE
const deleteposts = async (id) => {
  const response = await axios.delete(`${API}/${id}`);
  return response.data;
};

const PostsRQ = () => {
  const [title, settitle] = useState("");
  const [body, setbody] = useState("");
  const [editingId, setEditingId] = useState(null);

  const queryclient = useQueryClient();

  // GET QUERY
  const {
    data = [],
    isError,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getposts,
  });

  // POST MUTATION
  const { mutate: addPost, isPending: isAdding } = useMutation({
    mutationFn: postposts,
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["posts"],
      });
      settitle("");
      setbody("");
    },
  });

  // PUT MUTATION
  const { mutate: updatePost, isPending: isUpdating } = useMutation({
    mutationFn: putposts,
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["posts"],
      });
      setEditingId(null);
      settitle("");
      setbody("");
    },
  });

  // PATCH MUTATION
  const { mutate: patchPost, isPending: isPatching } = useMutation({
    mutationFn: patchposts,
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  // DELETE MUTATION
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: deleteposts,
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  // FORM SUBMIT (POST OR PUT)
  function handlesubmit(e) {
    e.preventDefault();

    if (!title.trim() || !body.trim()) return;

    if (editingId !== null) {
      updatePost({
        id: editingId,
        name: title,
        country: body,
      });
    } else {
      addPost({
        name: title,
        country: body,
      });
    }
  }

  // START EDITING
  function handleEdit(post) {
    setEditingId(post.id);
    settitle(post.name);
    setbody(post.country);
  }

  // CANCEL EDIT
  function handleCancel() {
    setEditingId(null);
    settitle("");
    setbody("");
  }

  // PATCH COUNTRY ONLY
  function handlePatch(post) {
    const newCountry = prompt("Enter new country:", post.country);

    if (newCountry === null || !newCountry.trim()) return;

    patchPost({
      id: post.id,
      country: newCountry,
    });
  }

  // DELETE
  function handleDelete(id) {
    if (window.confirm("Delete this footballer?")) {
      deletePost(id);
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
      <h2>
        {editingId !== null ? "Edit Footballer (PUT)" : "Add Footballer (POST)"}
      </h2>

      <form onSubmit={handlesubmit}>
        <input
          type="text"
          placeholder="Player name"
          value={title}
          onChange={(e) => settitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Country"
          value={body}
          onChange={(e) => setbody(e.target.value)}
        />

        <button type="submit" disabled={isAdding || isUpdating}>
          {isAdding || isUpdating
            ? "Saving..."
            : editingId !== null
              ? "Update (PUT)"
              : "Post"}
        </button>

        {editingId !== null && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h2>Footballers</h2>

      {isFetching && <p>Fetching latest data...</p>}

      <div className="players">
        {data.map((post) => (
          <div className="player" key={post.id}>
            <Link to={`/rq-posts/${post.id}`}>
              <h2>{post.name}</h2>
              <p>{post.country}</p>
            </Link>

            <button onClick={() => handleEdit(post)}>Edit (PUT)</button>

            <button onClick={() => handlePatch(post)} disabled={isPatching}>
              Patch Country
            </button>

            <button onClick={() => handleDelete(post.id)} disabled={isDeleting}>
              Delete
            </button>
          </div>
        ))}

        <button onClick={() => refetch()}>Refetch</button>
      </div>
    </div>
  );
};

export default PostsRQ;
