import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

export default function UpdateTweet() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [name, setName] = useState("");
  const [tweetData, setTweetData] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize with passed state
  useEffect(() => {
    if (location.state?.tweet) {
      setName(location.state.tweet.user?.name || "");
      setTweetData(location.state.tweet.tweetData);
      setExistingImage(location.state.tweet.image);
    } else {
      // Fallback if no state passed
      navigate("/tweets");
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("tweetData", tweetData);
      if (image) {
        formData.append("image", image);
      }

      const res = await axios.put(
        `http://localhost:7000/tweet/update/${id}`,
        formData,
        {
          headers: {
            "auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        alert("Tweet updated successfully");
        navigate("/tweets");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Tweet update failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Update Tweet</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div style={{ marginBottom: "10px" }}>
          <label>Name</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{ width: "100%", padding: "8px", fontSize: "14px" }}
            required
          />
        </div>

        {/* Tweet Text */}
        <div style={{ marginBottom: "10px" }}>
          <label>Tweet Text</label>
          <br />
          <textarea
            value={tweetData}
            onChange={(e) => setTweetData(e.target.value)}
            placeholder="What's happening?"
            rows={4}
            style={{ width: "100%" }}
            required
          />
        </div>

        {/* Current Image */}
        {existingImage && (
          <div style={{ marginBottom: "10px" }}>
            <label>Current Image</label>
            <br />
            <img
              src={`http://localhost:7000/uploads/${existingImage}`}
              alt="current tweet"
              width="200"
              style={{ marginTop: "10px" }}
            />
          </div>
        )}

        {/* New Image */}
        <div style={{ marginBottom: "10px" }}>
          <label>Upload New Image (Optional)</label>
          <br />
          <input
            type="file"
            style={{ width: "100%" }}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button type="submit">Update Tweet</button>
        <button
          type="button"
          onClick={() => navigate("/tweets")}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
