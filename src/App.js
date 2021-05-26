import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import IconButton from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";

const App = () => {
  const [imagesFetched, setImagesFetched] = useState(false);
  const [uploadImage, setUploadImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [justUploadedImage, setJustUploadedImage] = useState({});
  const [favourites, setFavourites] = useState([]);
  const [favouritesFetched, setFavouritesFetched] = useState([]);
  const [votes, setVotes] = useState([]);
  const [error, setError] = useState({
    error_status: false,
    error_message: "",
  });

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: "80%",
      height: 450,
    },
  }));

  function srcset(image, width, height, rows = 1, cols = 1) {
    return `${image}?w=${width * cols}&h=${
      height * rows
    }&fit=crop&auto=format 1x,
      ${image}?w=${width * cols}&h=${
      height * rows
    }&fit=crop&auto=format&dpr=2 2x`;
  }

  const ImageGrid = ({
    images,
    loaded,
    setFavourite,
    imageUpdate,
    favourites,
    votes,
  }) => {
    if (!loaded) return null;

    const starClickHandler = (imageId, sub_id, isFavourite, favouriteId) => {
      setFavourite(imageId, sub_id, isFavourite, favouriteId);
      imageUpdate();
    };

    const voteUpClickHandler = async (imageId, sub_id, votesValue) => {
      voteUp(imageId, sub_id, votesValue);
      imageUpdate();
    };

    const voteDownClickHandler = async (imageId, sub_id, votesValue) => {
      voteDown(imageId, sub_id, votesValue);
      imageUpdate();
    };

    return (
      <ImageList
        sx={{
          width: "100%",
          maxHeight: "100% !important",
          // Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
          transform: "translateZ(0)",
        }}
        rowHeight={200}
        gap={20}
        cols={4}
      >
        {images.map((item, index) => {
          const cols = item.featured ? 2 : 1;
          const rows = item.featured ? 2 : 1;
          const favouriteImageIds = favourites.map(
            (favourite) => favourite.image_id
          );

          let imageVotesValue = 0;
          const imageVotes = votes.filter((vote) => {
            return vote.image_id === item.id;
          });

          if (imageVotes.length) {
            imageVotesValue = imageVotes[0].value;
          }

          const imageIsFavourite = favouriteImageIds.includes(item.id);
          const favouritesImageIndex = favourites.findIndex(
            (favourite) => favourite.image_id === item.id
          );
          let favouriteId = 0;
          if (favouritesImageIndex > -1) {
            favouriteId = favourites[favouritesImageIndex].id;
          }

          return (
            <ImageListItem key={item.id + index} cols={cols} rows={rows}>
              <img
                srcSet={srcset(item.url, 250, 200, rows, cols)}
                alt={item.original_filename}
                loading="lazy"
              />
              <ImageListItemBar
                sx={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                    "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                }}
                title={item.title}
                position="top"
                actionIcon={
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <IconButton
                      sx={{
                        color: favouriteImageIds.includes(item.id)
                          ? "yellow"
                          : "white",
                      }}
                      aria-label={`star ${item.title}`}
                      onClick={(e) =>
                        starClickHandler(
                          item.id,
                          item.sub_id,
                          imageIsFavourite,
                          favouriteId,
                          setFavourite
                        )
                      }
                    >
                      <StarBorderIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: "white",
                      }}
                      aria-label={`star ${item.title}`}
                      onClick={(e) =>
                        voteUpClickHandler(
                          item.id,
                          item.sub_id,
                          imageVotesValue
                        )
                      }
                    >
                      <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                    <span
                      style={{
                        color: "white",
                        position: "relative",
                        top: "25px",
                      }}
                    >
                      {imageVotesValue}
                    </span>
                    <IconButton
                      sx={{ color: "white" }}
                      aria-label={`star ${item.title}`}
                      onClick={(e) =>
                        voteDownClickHandler(
                          item.id,
                          item.sub_id,
                          imageVotesValue
                        )
                      }
                    >
                      <IndeterminateCheckBoxOutlinedIcon />
                    </IconButton>
                  </div>
                }
                actionPosition="left"
              />
            </ImageListItem>
          );
        })}
      </ImageList>
    );
  };

  async function getUploadedFiles() {
    setImagesFetched(false);
    axios.defaults.headers.common["x-api-key"] =
      "0e4a38a2-b9a3-4865-96b6-156639088101"; // Replace this with your API Key
    let response = await axios
      .get("https://api.thecatapi.com/v1/images", {
        params: { limit: 100, size: "full" },
      })
      .then((response) => setUploadedImages(response.data))
      .then(() => setImagesFetched(true))
      .catch((error) => {
        setError({
          error_status: true,
          error_message: error.response.data.message,
        });
        setImagesFetched(false);
      });
  }

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
    setFavouritesFetched(false);
    axios.defaults.headers.common["x-api-key"] =
      "0e4a38a2-b9a3-4865-96b6-156639088101"; // Replace this with your API Key
    let response = await axios
      .get("https://api.thecatapi.com/v1/favourites")
      .then((response) => setFavourites(response.data))
      .then(() => setFavouritesFetched(true))
      .catch((error) => {
        setError({
          error_status: true,
          error_message: error.response.data.message,
        });
        setFavouritesFetched(false);
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
    }
  }

  useEffect(() => {
    getUploadedFiles();
  }, [justUploadedImage]);

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
      <ImageGrid
        images={uploadedImages}
        favourites={favourites}
        loaded={imagesFetched}
        imageUpdate={getUploadedFiles}
        setFavourite={setFavourite}
        voteUp={voteUp}
        voteDown={voteDown}
        getVotes={getVotes}
        votes={votes}
      />
    </div>
  );
};

export default App;
