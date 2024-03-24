import React from "react";
import Hls from 'hls.js';
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState ,useRef } from "react";
import { useNavigate } from "react-router-dom";

import JukeHost from "./JukeHost";
import S3 from "./S3";
import { TiTick } from "react-icons/ti";

const UpdateScreen = () => {
    const { bookName, chapterNumber } = useParams();
    const navigate = useNavigate();

    const [result, setResult] = useState(false);
    const [availability, setAvailability] = useState(true);
    const [loading, setLoading] = useState(true);

    const [loadingStatus, setLoadingStatus] = useState(true);
    const [chapter, setChapter] = useState({});
    const [bookimg, setBookimg] = useState(
        "https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png"
    );
    const [host, setHost] = useState("JukeHost");
    const [url, setUrl] = useState("");

    const [sessId, setSessId] = useState("");

    // const audioRef = useRef(null);

    // useEffect(() => {
    //     if(Hls.isSupported()) {
    //         const hls = new Hls();
    //         hls.loadSource('https://drive.usercontent.google.com/download?id=1tx_sUgeG4vqGWHfqMHjQXVOjGsqaSqG5');
    //         hls.attachMedia(audioRef.current);
    //         hls.on(Hls.Events.MANIFEST_PARSED, function() {
    //           audioRef.current.play();
    //         });
    //     }
    //     // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
    //     // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element through the `src` property. This is using the built-in support of the plain video element, without using hls.js.

    // }, []);

    

    // console.log(sessId);

    useEffect(() => {
        axios
            .get(`http://localhost:5000/book/${bookName}`)
            .then((res) => {
                // console.log(res.data[0].chapters);
                setChapter(res.data[0].chapters[chapterNumber - 1]);
                setBookimg(res.data[0].bookimg);
                setUrl(res.data[0].chapters[chapterNumber - 1].url);

                if (res.data[0].aws_hosted) {
                    setHost("S3");
                }
            })
            .finally(() => {
                setLoading(false);
            });

        if (localStorage.getItem("sessId")) {
            setSessId(localStorage.getItem("sessId"));
        }
    }, []);

    const handlePrev = () => {
        navigate(`/book/${bookName}/${parseInt(chapterNumber) - 1}`);
        window.location.reload();
    };

    const handleNext = () => {
        navigate(`/book/${bookName}/${parseInt(chapterNumber) + 1}`);
        window.location.reload();
    };

    const handleFetchUrl = () => {
        axios
            .get(`http://localhost:5000/mp3url/test.mp3`)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                console.log("URL Fetched");
            });
    };

    const checkAvailability = () => {
        console.log("Checking availability");

        setResult(true);

        const aws_hosted = host === "S3" ? true : false;
        const chapter_url = url;
        const base_jukehost = "https://audio.jukehost.co.uk/";

        if (!aws_hosted) {
            const controller = new AbortController();
            const signal = controller.signal;

            const url = `${base_jukehost}${chapter_url}`;

            console.log("Checking:", url);

            fetch(url, { signal })
                .then((response) => {
                    controller.abort(); // abort the request

                    if (response.status === 200) {
                        setAvailability(true);
                        setLoadingStatus(false);
                    } else {
                        setAvailability(false);
                        setLoadingStatus(false);
                    }
                })
                .catch((error) => {
                    if (error.name === "AbortError") {
                        console.log("Fetch aborted");
                    } else {
                        console.error("Error:", error);
                        setAvailability(false);
                    }
                });
        }
    };

    return (
        <div className="p-6 flex flex-col justify-start min-h-screen w-screen">
            <div className="flex justify-between ">
                <div>
                    {/* <h1 className=" text-4xl">Update</h1> */}
                    <p className="mb-24 text-3xl">Book: {bookName}</p>
                    <p>Chapter: {chapterNumber}</p>
                </div>

                <div>
                    <img
                        src={bookimg}
                        alt={bookName}
                        className="rounded-md h-36 w-28 object-fit "
                    />
                </div>
            </div>

            {loading ? (
                <p>Loading</p>
            ) : (
                <div>
                    <div className="mb-10">
                        <h1>{chapter.chapter_title}</h1>
                        <p>{chapter?.description}</p>
                    </div>

                    <div className="mb-16">
                        <div className="flex gap-2">
                            {result &&
                                (loadingStatus ? (
                                    <div className="animate-spin h-6 w-6 border-t-2 border-blue-500 rounded-full my-2 mx-2"></div>
                                ) : availability ? (
                                    <p className="text-green-500 py-2 px-4">
                                        {<TiTick size={24} />}
                                    </p>
                                ) : (
                                    <p className="text-red-500 py-2">
                                        Unavailable
                                    </p>
                                ))}
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={checkAvailability}
                            >
                                Run Health Check
                            </button>
                        </div>
                    </div>

                    <div className="mb-4 text-3xl">Update Source</div>

                    <div className="flex gap-4">
                        <div
                            className={`text-center flex-[50%] border ${
                                host === "JukeHost"
                                    ? "bg-purple-600 "
                                    : "bg-gray-800"
                            } `}
                        >
                            JukeHost
                        </div>
                        <div
                            className={`text-center flex-[50%] border ${
                                host === "S3" ? "bg-purple-600 " : "bg-gray-800"
                            } `}
                        >
                            AWS S3
                        </div>
                    </div>

                    {host === "JukeHost" && (
                        // <div className=" min-h-72 mt-12  text-2xl">
                        //     <div className="flex items-center my-2">
                        //         <div className=" flex-[50%]">
                        //             <p>Step 1: Upload Audio file on JukeHost</p>
                        //         </div>
                        //         <div className="flex-[50%]">
                        //             <a
                        //                 href="https://jukehost.co.uk/library/upload"
                        //                 target="_blank"
                        //             >
                        //                 <button className="bg-white text-black  font-semibold py-2 px-4 rounded">
                        //                     Go to JukeHost
                        //                 </button>
                        //             </a>
                        //         </div>
                        //     </div>
                        //     <div className="flex items-center mt-12">
                        //         <div className=" flex-[50%]">
                        //             <p>Step 2: Update the ID</p>
                        //         </div>
                        //         <div className="flex-[50%]">
                        //             <input
                        //                 type="text"
                        //                 className="bg-white text-black py-2 px-4 rounded w-[40vw]"
                        //                 value={url}
                        //                 onChange={(e) => setUrl(e.target.value)}
                        //             />
                        //         </div>
                        //     </div>

                        //     <div>
                        //         <button
                        //             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-12 w-full"
                        //             onClick={handleUpdateJHUrl}
                        //         >
                        //             Update Source URL
                        //         </button>
                        //     </div>

                        //     <div className="my-16 text-center text-4xl font-bold">
                        //         {" "}
                        //         OR
                        //     </div>

                        //     <div className="mb-12">
                        //         <h2 className="mb-8">
                        //             Step 1: Upload Directly* (Beta Version)
                        //         </h2>

                        //         <form
                        //             className="flex pr-12 content-center "
                        //             onSubmit={handleUploadtoJH}
                        //         >
                        //             <input
                        //                 type="file"
                        //                 name="audio_file"
                        //                 className="w-full text-lg"
                        //             />
                        //             <button
                        //                 className="bg-white text-black text-lg f py-2 px-4 rounded"
                        //                 type="submit"
                        //             >
                        //                 Upload
                        //             </button>
                        //         </form>
                        //     </div>

                        //     <div className="flex items-center mt-12">
                        //         <div className=" flex-[50%]">
                        //             <p>Step 2: Update the ID from the popup</p>
                        //         </div>
                        //         <div className="flex-[50%]">
                        //             <input
                        //                 type="text"
                        //                 className="bg-white text-black py-2 px-4 rounded w-[40vw]"
                        //                 value={url}
                        //                 onChange={(e) => setUrl(e.target.value)}
                        //             />
                        //         </div>
                        //     </div>

                        //     <div>
                        //         <button
                        //             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-12 w-full"
                        //             onClick={handleUpdateJHUrl}
                        //         >
                        //             Update Source URL
                        //         </button>
                        //     </div>
                        // </div>

                        <JukeHost
                            bookName={bookName}
                            chapterNumber={chapterNumber}
                            url={url}
                            setUrl={setUrl}
                        />
                    )}

                    {host === "S3" && (
                        <S3
                            bookName={bookName}
                            chapterNumber={chapterNumber}
                            url={url}
                            setUrl={setUrl}
                        />
                    )}
                </div>
            )}

            <div className="flex justify-between my-8">
                <button className="" onClick={handlePrev}>
                    Previous Chapter
                </button>
                <button className="" onClick={handleNext}>
                    Next Chapter
                </button>
            </div>

            <div>
                {/* <button onClick={handleFetchUrl}>Fetch URL from s3</button> */}

                {/* <audio controls ref={audioRef}>
            Your browser does not support the audio tag.
        </audio> */}
            </div>
        </div>
    );
};

export default UpdateScreen;
