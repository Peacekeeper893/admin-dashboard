import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { TiTick } from "react-icons/ti";

const ChapterView = ({ chapter, book }) => {
    const navigate = useNavigate();

    const [result, setResult] = useState(false);
    const [availability, setAvailability] = useState(true);
    const [loading, setLoading] = useState(true);

    const handleUpdate = () => {
        navigate(`/book/${book.name}/${chapter.chapter_number}`);
    };

    useEffect(() => {
        setTimeout(() => {
            // checkAvailability();
        }, 1000);
    }, []);

    const checkAvailability = () => {
        console.log("Checking availability");

        setResult(true);

        const aws_hosted = book.aws_hosted;
        const chapter_url = chapter.url;
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
              setLoading(false);
            } else {
              setAvailability(false);
              setLoading(false);
            }
          })
          .catch((error) => {
            if (error.name === 'AbortError') {
              console.log('Fetch aborted');
            } else {
              console.error("Error:", error);
              setAvailability(false);
            }
          });
      }
    };

    return (
        <div className="flex flex-col my-2 px-8 py-3 bg-slate-900">
            <div className="flex justify-between items-center">
                <div>Chapter {chapter.chapter_number}</div>

                <div className="flex gap-2">
                    {result &&
                        (loading ? (
                          <div className="animate-spin h-6 w-6 border-t-2 border-blue-500 rounded-full my-2 mx-2"></div>
                        ) : availability ? (
                            <p className="text-green-500 py-2 px-4">
                                {<TiTick size={24} />}
                            </p>
                        ) : (
                            <p className="text-red-500 py-2">Unavailable</p>
                        ))}
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={checkAvailability}
                    >
                        Health Check
                    </button>

                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleUpdate}
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChapterView;
