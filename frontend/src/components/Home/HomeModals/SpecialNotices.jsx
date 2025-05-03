import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

const SpecialNotices = () => {
  const { t } = useTranslation();
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [homeId, setHomeId] = useState(null);

  // Load user and token from localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        const homeId = localStorage.getItem("homeId");

        if (userData && token) {
          setUser({
            ...userData,
            token,
            homeId
          });

          const homeIdFromStorage = userData.homeID || userData.homeId;
          if (!homeIdFromStorage) {
            console.error("homeId not found in user data");
            setError("Home information not available");
          }
          setHomeId(homeIdFromStorage);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setError("Failed to load user data");
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Fetch notices
  useEffect(() => {
    const fetchNotices = async () => {
      if (!user?.token || !homeId) {
        setIsLoading(false);
        return;
      }
  
      try {
        const response = await axios.get("http://localhost:3500/api/notices", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          params: {
            homeId: homeId,
          },
        });
        setNotices(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || t("FAILED_TO_FETCH_NOTICES"));
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchNotices();
  }, [user?.token, homeId, t]);

  // Add new notice
  const handleAddNotice = async () => {
    if (!newNotice.trim()) {
      setError(t("NOTICE_MESSAGE_REQUIRED"));
      return;
    }

    if (!homeId) {
      setError("Home information is missing");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3500/api/notices",
        {
          message: newNotice,
          homeId: homeId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setNotices([response.data, ...notices]);
      setNewNotice("");
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || t("FAILED_TO_ADD_NOTICE"));
    }
  };

  // Delete notice
  const removeNotice = async (noticeId) => {
    try {
      await axios.delete(`http://localhost:3500/api/notices/${noticeId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setNotices(notices.filter((notice) => notice._id !== noticeId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || t("FAILED_TO_DELETE_NOTICE"));
    }
  };

  if (isLoading) return <div className="loading">{t("LOADING_NOTICES")}...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="special-notices">
      <div className="notices-header">
        <h2 className="notices-title">{t("SPECIAL_NOTICES")}</h2>
        {user?.token && (
          <button
            className="add-notice-button"
            onClick={() => setShowAddForm(!showAddForm)}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {showAddForm ? t("CANCEL") : t("ADD_NOTICE")}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="notice-form">
          <textarea
            className="notice-input"
            value={newNotice}
            onChange={(e) => setNewNotice(e.target.value)}
            placeholder={t("ENTER_NOTICE_MESSAGE")}
            rows={4}
          />
          <div className="form-actions">
            <button className="save-button" onClick={handleAddNotice} onMouseDown={(e) => e.stopPropagation()}>
              {t("SAVE_NOTICE")}
            </button>
          </div>
        </div>
      )}

     
        {notices.length === 0 ? (
          <p className="empty-notices">{t("NO_NOTICES_AVAILABLE")}</p>
        ) : (
          notices.map((notice) => (
            <div className="notice-card" key={notice._id} style={{backgroundColor: "#D84040", padding: "10px", marginBottom: "10px"}}>
              <div className="notice-content">
                <p className="notice-message" style={{color:"#fff"}}>📢 {notice.message}</p>
                <div className="notice-meta">
                  <span className="notice-author" style={{color:"#fff"}}>
                    {t("POSTED_BY")}: {notice.createdBy?.name || t("UNKNOWN_USER")}
                  </span>
                  <span className="notice-date" style={{color:"#fff"}}>
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {user &&
                (user._id === notice.createdBy?._id || user.role === "homeOwner") && (
                  <button
                    className="delete-notice"
                    onClick={() => removeNotice(notice._id)} onMouseDown={(e) => e.stopPropagation()}
                    aria-label={t("DELETE_NOTICE")}
                    style={{color:"#fff"}}
                  >
                    ×
                  </button>
                )}
            </div>
          ))
        )}
      </div>
    
  );
};

export default SpecialNotices;
