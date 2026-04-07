import {BASE_URL} from "../../utils/constants";
import { useDispatch } from "react-redux";
import { addFeed } from "../../features/feed/feedSlice";
import { refreshRequests } from "../../features/request/refreshRequests";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import React from "react";
import styles from "../../../public/button.module.css";
import { FaHeart } from 'react-icons/fa';

import Modal from "./Modal";
import { useState } from "react";
const Card = (feed) => {
        const navigate = useNavigate();
const [open, setOpen] = useState(false);
const [modalData, setModalData] = useState({
  title: "",
  message: "",
  type: ""
});
    const dispatch = useDispatch();
    if (!feed?.feed?.length) {
        return <p>No data available</p>;
    }

    const sendInterest = async (cardData, status) => {
        const user = feed.feed.find((a) => a._id === cardData._id)?._id;
        if (!user) {
            console.error("User not found in feed");
            return;
        }

        try {
  const response = await fetch(
    `${BASE_URL}request/send/${status}/${user}`,
    {
      method: "POST",
      credentials: "include",   
    }
  );
 if (response.status === 400) {
  setModalData({
    title: "Hey!",
    message: "You have already sent a request to this user.",
    type: "error"
  });
  setOpen(true);
} else if (response.status === 200) {
  setModalData({
    title: "Awesome!!",
    message: "Request sent successfully.",
    type: "success"
  });
  setOpen(true);
  dispatch(
    addFeed(feed.feed.filter((u) => u._id !== cardData._id))
  );
  void refreshRequests(dispatch);
}

  await response.json();
}  catch (err) {
            console.error("Failed to send interest:", err);
            if (err.message.includes("401")) {
                navigate("./login")
                // Handle unauthorized error (e.g., navigate to login page)
            }
        }
    };

    return (
        <div className="gap-4 m-4">
            {feed.feed.map((cardData) => (
                <div className="card gap-4 m-4 block  sm:inline-flex xl:inline-block md:inline-flex lg:inline-flex  bg-base-100 w-2/6 sm:w-1/4 lg:w-1/6 xl:w-1/6 shadow-2xl" key={cardData._id}>
                    <figure>
                        <img
                            className="w-3/5"
                            src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                            alt={cardData.firstName || "User Image"}
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">{cardData.firstName || "Unnamed User"}</h2>
                        <div className="card-actions justify-end">
                            <Button 
                              className={styles.customButton}
                              onClick={() => sendInterest(cardData, "ignored")}>Ignore</Button>
                         {open && (
  <Modal
    isOpen={open}
    type={modalData.type}
    title={modalData.title}
    message={modalData.message}
    onClose={() => setOpen(false)}
  />
)}
                            <Button 
                            className={styles.customButton}
                            onClick={() => sendInterest(cardData, "interested")}>
                              <FaHeart style={{ marginRight: '0.5rem' }} />
                                Interested
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Card;
