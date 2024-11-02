import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlanCard.css";

export default function PlanCard({ userPlan, isMoving, onDelete, planIndex }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  function handleClick(e) {
    if (isMoving) {
      e.preventDefault();
      return;
    }
    navigate(`/plan/${userPlan._id}`);
  }

  function handleDelete(e) {
    e.stopPropagation(); // Prevent click event from bubbling up to the <a> tag
    e.preventDefault();
    onDelete(userPlan._id, planIndex);
  }

  return (
    <a
      onClick={handleClick}
      href={`/plan/${userPlan._id}`}
      className="plan-card-link"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`plan-card ${isHovered ? "plan-card-hover" : ""}`}>
        <div
          className="plan-card-media"
          style={{ backgroundImage: "url('/static/images/temp-background.jpeg')" }}
          title={userPlan.title}
        />
        <div className="plan-card-content">
          <h6 className="plan-card-title">{userPlan.title}</h6>
        </div>

        {/* Delete Icon */}
        <button
          className={`plan-card-delete-icon ${isHovered ? "visible" : ""}`}
          onClick={handleDelete}
        >
          🗑️
        </button>
      </div>
    </a>
  );
}
