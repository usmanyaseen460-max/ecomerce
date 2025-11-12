import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = (props) => {
  // Accept multiple naming conventions from data: new_price, new_Price, newPrice
  const newPrice = props.new_price ?? props.newPrice ?? props.new_Price ?? null;
  const oldPrice = props.old_price ?? props.oldPrice ?? props.old_Price ?? null;
  // Accept image prop under either `image` or `img`
  const imageSrc = props.image ?? props.img ?? '';

  return (
    <div className="item">
      <Link to={`/product/${props.id}`}> {/* ✅ fixed route here */}
        <img src={imageSrc} alt="" />
        <p>{props.name}</p>
      </Link>

      <div className="item-prices">
        <div className="item-price-new">PKR {newPrice}</div>
        <div className="item-price-old">PKR {oldPrice}</div>
      </div>
    </div>
  );
};

export default Item;