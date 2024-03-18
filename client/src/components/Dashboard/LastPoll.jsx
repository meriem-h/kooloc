import React from "react";

export const LastPoll = (props) => {
  const polls = props.polls;
  const latestQuestion = polls.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )[0];

  return (
    <div>
      {latestQuestion ? (
        <>
          <div>
            <h1>{latestQuestion.question}</h1>
          </div>
          <div className="choices">
            {latestQuestion.choices.map((choice) => (
              <button key={choice.id}>{choice.title}</button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};
