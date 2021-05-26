import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Upload from "./components/upload";
import Home from "./components/home";
import { useViewport } from "./hooks/customHooks";
import ErrorMessage from "./components/error";
import { Status } from "./components/error";

function App() {
  const [imagesFetched, setImagesFetched] = useState(false);
  const [uploadFileReady, setUploadFileReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadImage, setUploadImage] = useState({});
  const [justUploadedImage, setJustUploadedImage] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [votes, setVotes] = useState([]);
  const breakpoint = 620;
  const [error, setError] = useState({
    error_status: false,
    error_message: "",
  });
  const { width } = useViewport();
  const heroImageIndex = 0;

  async function getUploadedFiles() {
    setImagesFetched(false);
    axios.defaults.headers.common["x-api-key"] =
      "0e4a38a2-b9a3-4865-96b6-156639088101"; // Replace this with your API Key
    await axios
      .get("https://api.thecatapi.com/v1/images", {
        params: { limit: 100, size: "full" },
      })
      .then((response) => setUploadedImages(response.data))
      .then(() => setImagesFetched(true))
      .then(() => getFavourites())
      .then(() => getVotes())
      .catch((error) => {
        setError({
          error_status: true,
          error_message: error.response.data.message,
        });
        setImagesFetched(false);
      });
  }

  const uploadFile = async () => {
    setUploading(true);
    let formData = new FormData();
    formData.append("file", uploadImage);
    formData.append("sub_id", Date.now());

    axios.defaults.headers.common["x-api-key"] =
      "0e4a38a2-b9a3-4865-96b6-156639088101"; //"DEMO-API-KEY"; // Replace this with your API Key
    await axios
      .post("https://api.thecatapi.com/v1/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => setJustUploadedImage(response.data))
      .then(() => setUploadImage(null))
      .catch((error) => {
        setError({
          error_status: true,
          error_message: error.response.data.message,
        });
      });
    setUploading(false);
    setUploadFileReady(false);
  };

  const voteDown = async (id, sub_id, votesValue) => {
    axios.defaults.headers.common["x-api-key"] =
      "0e4a38a2-b9a3-4865-96b6-156639088101"; //"DEMO-API-KEY"; // Replace this with your API Key

    let requestBody = {
      image_id: id,
      sub_id: sub_id,
      value: votesValue > 0 ? votesValue - 1 : 0,
    };

    await axios
      .post(`https://api.thecatapi.com/v1/votes`, requestBody, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => console.log("favorite response", response.data))
      .then(() => getVotes())
      .catch((error) => {
        console.log("favorite response", error);
      });
  };

  const voteUp = async (id, sub_id, votesValue) => {
    axios.defaults.headers.common["x-api-key"] =
      "0e4a38a2-b9a3-4865-96b6-156639088101"; //"DEMO-API-KEY"; // Replace this with your API Key

    let requestBody = {
      image_id: id,
      sub_id: sub_id,
      value: votesValue + 1,
    };

    await axios
      .post(`https://api.thecatapi.com/v1/votes`, requestBody, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => console.log("favorite response", response.data))
      .then(() => getVotes())
      .catch((error) => {
        console.log("favorite errors", error);
      });
  };

  const getVotes = async (sub_id) => {
    axios.defaults.headers.common["x-api-key"] =
      "0e4a38a2-b9a3-4865-96b6-156639088101"; //"DEMO-API-KEY"; // Replace this with your API Key

    let requestBody = {
      params: { order: "DESC", limit: 25 } /*, sub_id: sub_id*/,
    };

    await axios
      .get(`https://api.thecatapi.com/v1/votes`, requestBody, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => setVotes(response.data))
      .catch((error) => {
        console.log("getVotes error", error);
      });
  };

  const setFavourite = async (id, sub_id, isFavourite, favouriteId) => {
    axios.defaults.headers.common["x-api-key"] =
      "0e4a38a2-b9a3-4865-96b6-156639088101"; //"DEMO-API-KEY"; // Replace this with your API Key
    let favouritesUrl = `https://api.thecatapi.com/v1/favourites`;
    let requestBody = { image_id: id, sub_id: sub_id };
    if (isFavourite) {
      favouritesUrl = `${favouritesUrl}/${favouriteId}`;
      requestBody = {};

      await axios
        .delete(favouritesUrl, requestBody, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => console.log("favorite response", response.data))
        .then(() => getFavourites())
        .catch((error) => {
          console.log(" setting favorite error", error);
        });
    } else {
      await axios
        .post(favouritesUrl, requestBody, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => console.log("favorite response", response.data))
        .then(() => getFavourites())
        .catch((error) => {
          console.log("setting favorite error", error);
        });
    }
  };

  async function getFavourites() {
    axios.defaults.headers.common["x-api-key"] =
      "0e4a38a2-b9a3-4865-96b6-156639088101"; // Replace this with your API Key
    await axios
      .get("https://api.thecatapi.com/v1/favourites")
      .then((response) => setFavourites(response.data))
      .catch((error) => {
        setError({
          error_status: true,
          error_message: error.response.data.message,
        });
      });
  }

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
      setUploadFileReady(true);
    }
  }

  useEffect(() => {
    getUploadedFiles();
  }, [justUploadedImage]);

  return (
    <Router>
      <div style={{ textAlign: "center", fontSize: "xx-large" }}>
        Cat Gallery
      </div>
      <Switch>
        <Route exact path="/">
          <Home
            heroImageIndex={heroImageIndex}
            uploadedImages={uploadedImages}
            favourites={favourites}
            imagesFetched={imagesFetched}
            error={error}
            getUploadedFiles={getUploadedFiles}
            setFavourite={setFavourite}
            voteUp={voteUp}
            voteDown={voteDown}
            getVotes={getVotes}
            votes={votes}
            width={width}
            breakpoint={breakpoint}
          />
          {error.error_status ? (
            <ErrorMessage error={error} />
          ) : (
            <Status message={uploading ? "loading..." : ""} />
          )}
        </Route>
        <Route path="/upload">
          <Upload
            uploadFileReady={uploadFileReady}
            uploadFile={uploadFile}
            onFilePicked={onFilePicked}
          />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
