import React from "react";

import {
    UserButton,
} from "@clerk/clerk-react";

import Home from "./Home";


const HomeScreen = () => {
    return (
        <>
            <div className="flex justify-between p-2  items-center">

                <div className="px-2 pt-2">
                    <UserButton />
                    </div>
                <h2 className="text-center text-3xl">
                    Welcome to the Admin Panel
                </h2>
                <div></div>
            </div>
            <hr className="my-4 -mx-4 " />
            <div className="min-h-screen w-[calc(100vw-4rem)] pt-8  mt-4">
                <Home />
            </div>
        </>
    );
};

export default HomeScreen;
