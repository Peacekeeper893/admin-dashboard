import React from "react";
// import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Modal from "react-modal";

const JukeHost = ({ bookName, chapterNumber, url, setUrl }) => {
    const [uploading, setUploading] = useState(false);

    Modal.setAppElement("#root");

    function generateKeyFromWords(bname, cnum) {
        // Split the input string into an array of words
        const words = bname.split(" ");

        // Map over the array and extract the first letter of each word
        const initials = words.map((word) => word.charAt(0).toUpperCase());

        // Concatenate the initials to form the key
        const key = initials.join("");

        const key2 = key + cnum;

        return key2;
    }

    const handleUpdateJHUrl = () => {
        axios
            .put(`http://localhost:5000/update/${bookName}/${chapterNumber}`, {
                url: url,
            })
            .then((res) => {
                console.log(res);
                window.alert("URL Updated");
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                console.log("URL Updated");
            });
    };

    const handleUploadtoJH = (e) => {
        console.log("Uploading to JH");
        e.preventDefault();

        const url = "https://audio.jukehost.co.uk/upload";
        const ownerID = "32619"; // replace with your owner ID
        const csrfToken = ""; // replace with your CSRF token

        // Get the file from the file input element
        const file = e.target.elements.audio_file.files[0];
        // console.log(file);

        // Create a new FormData instance
        let formData = new FormData();

        const server_file_name = generateKeyFromWords(bookName, chapterNumber);
        const search_id = server_file_name + ".mp3";

        // Append the file, owner ID, and CSRF token to the form data
        if (file instanceof Blob) {
            formData.append("file", file, server_file_name + ".mp3");
            formData.append("owner", ownerID);
            formData.append("CSRF_TOKEN", csrfToken);

            setUploading(true);
        } else {
            window.alert("No file selected");
            return;
        }

        // Send the axios request
        axios
            .post(url, formData, {
                headers: {
                    Accept: "*/*",
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log(response.data);
                setUploading(false);
                // Extract the session ID from the 'set-cookie' header
                console.log(response.headers);
            })
            .catch((error) => {
                window.alert("Error in Loading the file");
                console.log(error);
            })
            .then(() => {
                const target_url =
                    "https://jukehost.co.uk/api/internal/library/track/search/" +
                    server_file_name +
                    ".mp3";

                window.open(target_url, "_blank", "width=500,height=500");
            })
            .catch((error) => {
                window.alert("Error Uploading to JH" + error);
                console.log(error);
            });
    };

    return (
        <>
            <Modal
                isOpen={uploading}
                onRequestClose={() => setUploading(false)}
                contentLabel="Uploading Modal"
            >
                <div className="flex content-center justify-center">
                    <div className="animate-spin h-60 w-60 border-t-2 border-blue-500 rounded-full my-2 mx-2"></div>
                </div>
                <div className="text-3xl text-black text-center mt-4"> Uploading .... </div>
            </Modal>

            <div className=" min-h-72 mt-12  text-2xl">
                <div className="flex items-center my-2 mb-12">
                    <div className=" flex-[40%]">
                        <p>Step 1: Upload Directly* (Beta Version)</p>
                    </div>
                    <div className=" flex-[10%]">
                        <p>OR</p>
                    </div>
                    <div className="flex-[40%]">
                        <a
                            href="https://jukehost.co.uk/library/upload"
                            target="_blank"
                        >
                            <button className="bg-white text-black  font-semibold py-2 px-4 rounded w-[90%]">
                                Go to JukeHost
                            </button>
                        </a>
                    </div>
                </div>

                {/* <div className="flex items-center mt-12">
                <div className=" flex-[50%]">
                    <p>Step 2: Update the ID</p>
                </div>
                <div className="flex-[50%]">
                    <input
                        type="text"
                        className="bg-white text-black py-2 px-4 rounded w-[40vw]"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-12 w-full"
                    onClick={handleUpdateJHUrl}
                >
                    Update Source URL
                </button>
            </div>

            <div className="my-16 text-center text-4xl font-bold"> OR</div> */}

                <div className="mb-12">
                    <form
                        className="flex gap-3 pr-12 content-center "
                        onSubmit={handleUploadtoJH}
                    >
                        <input
                            type="file"
                            name="audio_file"
                            className="w-full text-lg border-2 py-3 p-2 border-white border-solid"
                        />
                        <button
                            className="bg-white text-black text-lg f py-2 px-4 rounded "
                            type="submit"
                        >
                            Upload
                        </button>
                    </form>
                </div>

                <div className="flex items-center mt-12">
                    <div className=" flex-[50%]">
                        <p>Step 2: Update the ID from the popup</p>
                    </div>
                    <div className="flex-[50%]">
                        <input
                            type="text"
                            className="bg-white text-black py-2 px-4 rounded w-[40vw]"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-12 w-full"
                        onClick={handleUpdateJHUrl}
                    >
                        Update Source URL
                    </button>
                </div>
            </div>
        </>
    );
};

export default JukeHost;
