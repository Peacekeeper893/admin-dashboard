import React from "react";
import { useState } from "react";
import axios from "axios";
import ChapterView from "./ChapterView";

const BookTab = ({ book }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chapters, setChapters] = useState([]);

    const handleViewChapters = () => {
        setOpen(!open);

        axios.get(`http://localhost:5000/book/${book.name}`).then((res) => {
            // console.log(res.data[0].chapters);
            setChapters(res.data[0].chapters);
            setLoading(false);
        });
    }

    return (
        <div>
            <div key={book.name} className="flex flex-col mb-4 p-6">
                <div className="flex">
                    <div className="flex-[25%]">
                        <img
                            src={book.bookimg}
                            alt={book.name}
                            className="rounded-lg h-[20rem] w-[15rem] object-fit "
                        />
                    </div>

                    <div className="flex-[50%]">
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <h2 className="text-xl font-bold mt-2">
                                    {book.name}
                                </h2>
                                <p className="text-lg font-semibold mt-2">
                                    {book.author}
                                </p>
                            </div>
                            <div className="mb-2">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[12rem]" onClick={handleViewChapters}>
                                    View Chapters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {open && <div className="">
                
                {loading ? <p>Loading</p> : <div>

                    {chapters.map((chapter) => (
                        <ChapterView chapter={chapter} book={book} />
                        ))}
                    


                </div>
                }

            
            
            </div>}
            <hr className=" border-purple-400 shadow-xl -mx-4" />
        </div>
    );
};

export default BookTab;
