import React from "react";

export const ItemsList = (props) => {
  const items = props.itemsList;

  const formatItemsArray = items.reduce((accumulator, currentArray) => {
    return accumulator.concat(currentArray);
  }, []);

  formatItemsArray.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div>
      <ul>
        {formatItemsArray
          ? formatItemsArray.map((item) => (
              <li key={item.id}>{item.content}</li>
            ))
          : null}
      </ul>
    </div>
  );
};
