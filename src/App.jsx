import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import PostsRQ from "./components/PostsRQ";
import Oldway from "./components/Oldway";

import "./App.css";
import POSTDETAIL from "./components/POSTDETAIL";
import Pagination from "./components/Pagination";

function App() {
  const hideNavbar = window.location.pathname === "/paginated-players";

  return (
    <BrowserRouter>
      <div>
        {!hideNavbar && (
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/posts">Traditional Posts</Link>
              </li>

              <li>
                <Link to="/rq-posts">RQ Posts</Link>
              </li>
            </ul>
          </nav>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Oldway />} />
          <Route path="/rq-posts" element={<PostsRQ />} />
          <Route path="/rq-posts/:id" element={<POSTDETAIL />} />
          <Route path="/paginated" element={<Pagination />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
