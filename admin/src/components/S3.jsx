import React from 'react'

const S3 = ({ bookName, chapterNumber, url, setUrl }) => {

    
    function generateKeyFromWords(bname, cnum) {
        // Split the input string into an array of words
        const words = bname.split(" ");

        // Map over the array and extract the first letter of each word
        const initials = words.map((word) => word.charAt(0).toUpperCase());

        // Concatenate the initials to form the key
        const key = initials.join("");

        const key2 = key + "_" + cnum;

        return key2;
    }
    

    const handleUploadtoS3 = async (e) => {

        e.preventDefault();

        
        // Get the file from the file input element
        const file = e.target.elements.audio_file.files[0];
        const server_file_name = generateKeyFromWords(bookName, chapterNumber);

        // const { uploadURL } = await fetch("http://localhost:5000/s3url/" + server_file_name).then((res) => res.json());
        // console.log(uploadURL);

        // await fetch(uploadURL , {
        //     method: "PUT",
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //     },
        //     body: file,

        // })

        const loc = uploadURL.split("?")[0];
        console.log(loc);



    }
    
  return (
      <>
          
          
          <div className="my-12">
                <h2 className="mb-8">
                    Step 1: Upload Directly to S2
                </h2>

                <form
                  className="flex pr-12 content-center "
                  
                  onSubmit={handleUploadtoS3}
                    
                >
                    <input
                        type="file"
                        name="audio_file"
                        className="w-full text-lg"
                    />
                    <button
                        className="bg-white text-black text-lg f py-2 px-4 rounded"
                        type="submit"
                    >
                        Upload
                    </button>
                </form>
            </div>




      </>
  )
}

export default S3