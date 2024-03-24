import React from "react";
import { useEffect, useState } from "react";
import BookTab from "./BookTab";

const BookDisplay = ({ contents }) => {
    console.log(contents);
    return (
        <div>
            {contents &&
                contents.map((book) => (

                    <BookTab book={book} />
                ))}
        </div>
    );
};

export default BookDisplay;
