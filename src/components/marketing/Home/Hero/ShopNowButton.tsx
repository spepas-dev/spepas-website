// src/components/ShopNowButton.tsx
import './ShopNowButton.scss'; // ← this brings in all the SCSS above

import React from 'react';

const ShopNowButton: React.FC = () => {
  return (
    <div className="button-wrapper">
      {/* Hiding the checkbox; toggles when user clicks the label */}
      <input type="checkbox" id="shop-btn" />

      <label htmlFor="shop-btn">
        <div className="button_inner">
          {/* The “icon” at left (use any icon font or SVG; here we use Ionicons classname as in your sample) */}
          <i className="l ion-log-in" />

          {/* The visible text */}
          <span className="t">Shop Now</span>

          {/* The checkmark that appears after “final” animation */}
          <span>
            <i className="tick ion-checkmark-round" />
          </span>

          {/* 52 particle spots */}
          <div className="b_l_quad">
            {Array.from({ length: 52 }).map((_, i) => (
              <span key={i} className="button_spots" />
            ))}
          </div>
        </div>
      </label>
    </div>
  );
};

export default ShopNowButton;
