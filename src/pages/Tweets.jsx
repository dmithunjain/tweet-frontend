import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Tweets() {
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTweet, setEditingTweet] = useState(null);
  const [editName, setEditName] = useState("");
  const [editTweetData, setEditTweetData] = useState("");
  const [editImage, setEditImage] = useState(null);

  const fetchTweets = async () => {
    try {
      const res = await axios.get(
        "http://localhost:7000/tweet/get-tweets"
      );

      console.log("TWEETS RESPONSE:", res.data);

      if (res.data.success) {
        setTweets(res.data.data);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (tweet) => {
    setEditingTweet(tweet);
    setEditName(tweet.user?.name || "");
    setEditTweetData(tweet.tweetData);
    setEditImage(null);
    setModalOpen(true);
  };

  const closeEditModal = () => {
    setModalOpen(false);
    setEditingTweet(null);
    setEditName("");
    setEditTweetData("");
    setEditImage(null);
  };

  const updateTweet = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("tweetData", editTweetData);
      if (editImage) {
        formData.append("image", editImage);
      }

      const res = await axios.put(
        `http://localhost:7000/tweet/update/${editingTweet._id}`,
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
        // Update the tweet in the list
        setTweets(tweets.map(tweet => 
          tweet._id === editingTweet._id 
            ? { ...tweet, tweetData: editTweetData, user: { ...tweet.user, name: editName } }
            : tweet
        ));
        closeEditModal();
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Tweet update failed");
    }
  };

  const deleteTweet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tweet?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:7000/tweet/delete/${id}`,
        {
          headers: {
            "auth-token": token,
          },
        }
      );

      if (res.data.success) {
        alert("Tweet deleted successfully");
        setTweets(tweets.filter((tweet) => tweet._id !== id));
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete tweet");
    }
  };

  // ✅ CALL API ONLY ONCE
  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div>
      <h2>All Tweets</h2>

      {tweets.map((tweet) => (
        <div key={tweet._id} style={{ border: "1px solid #444", padding: "20px", margin: "20px 0", borderRadius: "8px", maxWidth: "500px" }}>
          {/* Display the author name from the populated user object */}
          <h4 style={{ margin: "0 0 10px 0", textAlign: "center" }}>
             By: {tweet.user?.name || "Anonymous"} 
          </h4>
          
          <p style={{ margin: "0 0 15px 0", textAlign: "center" }}>{tweet.tweetData}</p>
          
          {/* Image and View Image button container */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", gap: "10px" }}>
            <img src={`http://localhost:7000/uploads/${tweet.image}`} alt="tweet" width="200" />
            <button 
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                color: "white",
                border: "1px solid white",
                borderRadius: "4px",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }} 
              onClick={() => window.open(`http://localhost:7000/uploads/${tweet.image}`)}
            >
              View Image
            </button>
          </div>

          {/* Update and Delete buttons container */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <button 
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: "white",
                border: "1px solid white",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }} 
              onClick={() => openEditModal(tweet)}
            >
              Update
            </button>
            <button 
              style={{
                padding: "10px 20px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }} 
              onClick={() => deleteTweet(tweet._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {modalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "#2a2a2a",
            padding: "30px",
            borderRadius: "8px",
            minWidth: "400px",
            border: "1px solid #444"
          }}>
            <h3 style={{ marginTop: 0 }}>Edit Tweet</h3>
            
            <form onSubmit={updateTweet}>
              {/* Name Field */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    borderRadius: "4px",
                    border: "1px solid #444",
                    backgroundColor: "#333",
                    color: "white",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>

              {/* Tweet Data Field */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Tweet Text</label>
                <textarea
                  value={editTweetData}
                  onChange={(e) => setEditTweetData(e.target.value)}
                  placeholder="What's happening?"
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    borderRadius: "4px",
                    border: "1px solid #444",
                    backgroundColor: "#333",
                    color: "white",
                    boxSizing: "border-box",
                    fontFamily: "Arial, sans-serif"
                  }}
                  required
                />
              </div>

              {/* Image Upload Field */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Update Image (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setEditImage(e.target.files[0])}
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "14px",
                    borderRadius: "4px",
                    border: "1px solid #444",
                    backgroundColor: "#333",
                    color: "white",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={closeEditModal}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "transparent",
                    color: "white",
                    border: "1px solid white",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Update Tweet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
