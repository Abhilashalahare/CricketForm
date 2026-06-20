import React from "react";

const GiftPopup = ({ giftInfo, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* <button onClick={onClose} className="absolute top-3 right-4 text-2xl">
          ×
        </button> */}

        <div className="text-center">
          <div className="text-5xl mb-3">🎁</div>

          <h2 className="text-2xl font-bold text-green-600">
            Special Gift Offer
          </h2>

          <p className="mt-3 text-gray-600">
            First 50 registered players will receive a special gift.
          </p>

          <div className="mt-5 bg-yellow-50 border rounded-xl p-4">
            <p className="text-gray-500">Remaining Gift Slots</p>

            <h1 className="text-5xl font-bold text-red-600 animate-pulse">
              {giftInfo.remainingSeats}
            </h1>

            <p className="text-green-600 font-semibold mt-2">
              {giftInfo.claimedSlots} Players Already Registered
            </p>

            <p className="text-sm mt-2 text-gray-500">
              Out of {giftInfo.totalSlots}
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftPopup;