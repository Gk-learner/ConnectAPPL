import React, { useEffect } from "react";
import { BASE_URL } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "./feedSlice";
import Card from "../../shared/components/Card";

const Feed = () => {
  const dispatch = useDispatch();
    const feed = useSelector((store) => store.feed);
    const fetchUser = async () => {
        try {
            const response = await fetch(`${BASE_URL}feed`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const res = await response.json();
            dispatch(addFeed(res ?? []));
        } catch (err) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        // if (!userData) {
        fetchUser();
        // }
    }, []);
     return <div className=" p-4 text-center justify-start">{feed && <Card feed={feed} />}</div>;


};

export default Feed;

