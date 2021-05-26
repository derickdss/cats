import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [uploadImage, setUploadImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [justUploadedImage, setJustUploadedImage] = useState({});
  const [error, setError] = useState({
    error_status: false,
    error_message: "",
  });

  const uploadFile = async () => {
    setUploading(true);
    let formData = new FormData();
    formData.append("file", uploadImage);
    formData.append("sub_id", Date.now());

    axios.defaults.headers.common["x-api-key"] =
      "0e4a38a2-b9a3-4865-96b6-156639088101"; //"DEMO-API-KEY"; // Replace this with your API Key
    let response = await axios
      .post("https://api.thecatapi.com/v1/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => setJustUploadedImage(response.data))
      .then(() => setUploading(false))
      .then(() => setUploadImage(null))
      .catch((error) => {
        setError({
          error_status: true,
          error_message: error.response.data.message,
        });
        setUploading(false);
        setUploadImage(null);
      });
  };

  function onFilePicked(e) {
    const files = e.target.files;
    if (files[0] !== undefined) {
      if (files[0].name.lastIndexOf(".") <= 0) {
        setError({
          error_status: true,
          error_message: "Invalid File type",
        });
        return;
      }
      setUploadImage(files[0]);
    }
  }

  return (
    <div>
      <div>App here</div>
      <input
        style={{
          textAlign: "center",
          margin: "2% 4%",
        }}
        type="file"
        name="file"
        onChange={onFilePicked}
      />
      <button
        style={{ width: "30%", backgroundColor: "lightgrey" }}
        onClick={() => console.log("uploading")}
      >
        Upload
      </button>
    </div>
  );
};

export default App;
