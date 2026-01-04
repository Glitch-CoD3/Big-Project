import React from "react";

function SubscribeButton({ isSubscribed, onSubscribe }) {
  return (
    <button
      onClick={onSubscribe}
      className={`px-5 py-2 rounded-full font-bold text-sm transition-colors
        ${
          isSubscribed
            ? "bg-zinc-300 text-black hover:bg-zinc-400"
            : "bg-white text-black hover:bg-zinc-200"
        }`}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}

export default SubscribeButton;
