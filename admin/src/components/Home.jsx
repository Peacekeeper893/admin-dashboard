import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import BookDisplay from "./BookDisplay";

const Home = ({}) => {
    const [books, setBooks] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBooks = async () => {
            try {
                const books = await axios.get("http://localhost:5000/books");
                setBooks(books.data);
                // console.log(books);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getBooks();
    }, []);

    const itemsPerPage = 5;
    // Simulate fetching books from another resources.
    // (This could be books from props; or books loaded in a local state
    // from an API endpoint with useEffect and useState)
    const endOffset = itemOffset + itemsPerPage;
    // console.log(`Loading books from ${itemOffset} to ${endOffset}`);
    const currentItems = books.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(books.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % books.length;
        // console.log(
        //     `User requested page number ${event.selected}, which is offset ${newOffset}`
        // );
        setItemOffset(newOffset);
    };

    return (
        <>
            {loading ? (
                <p>Loading</p>
            ) : (
                    <div>
                        <h1 className="px-4 mb-12 text-4xl font-semibold font-serif">Recently Added Books</h1>
                    <BookDisplay contents={books.slice().reverse().slice(itemOffset, itemOffset + itemsPerPage)} />
                        <ReactPaginate
                            className="react-paginate"
                        breakLabel="..."
                        nextLabel="next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="< previous"
                        renderOnZeroPageCount={null}
                    />
                </div>
            )}
        </>
    );
};

export default Home;
