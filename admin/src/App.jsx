import { useState } from "react";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from "@clerk/clerk-react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomeScreen from "./components/HomeScreen";
import ChapterView from "./components/ChapterView";
import UpdateScreen from "./components/UpdateScreen";

import Home from "./components/Home";
import Test from "./components/Test";

function App() {
    return (
        <div className="">
            <SignedOut>
                <div className="">
                    <SignInButton />
                </div>
            </SignedOut>
            <SignedIn>
                <Router>
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route
                            path="/book/:bookName/:chapterNumber"
                            element={<UpdateScreen />}
                        />
                        <Route
                            path="/test"
                            element={<Test />}
                        />
                    </Routes>
                </Router>
            </SignedIn>
        </div>
    );
}

export default App;
