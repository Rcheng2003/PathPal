import React from "react";
import "./ExploreList.css";
import PlaceDetails from "../PlaceDetails/PlaceDetails";

export default function ExploreList({ plan, type, setType, places, lists }) {
  return (
    <div className="ExploreList-container">
      <div className="ExploreList-form">
        <label htmlFor="type-selector" className="ExploreList-label">
          Type
        </label>
        <select
          id="type-selector"
          className="ExploreList-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value={"restaurants"}>Restaurants</option>
          <option value={"attractions"}>Attractions</option>
          <option value={"hotels"}>Hotels</option>
        </select>
      </div>
      <div className="ExploreList-placesContainer">
        {places?.map(
          (place, i) =>
            place["name"] && (
              <PlaceDetails
                plan={plan}
                place={place}
                lists={lists}
                key={i}
                className="ExploreList-placeCard"
              />
            )
        )}
      </div>
    </div>
  );
}
