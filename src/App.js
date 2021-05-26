import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import IconButton from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";

const App = () => {
  const [imagesFetched, setImagesFetched] = useState(false);
  const [uploadImage, setUploadImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [justUploadedImage, setJustUploadedImage] = useState({});
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

  const ImageGrid = ({ images, loaded }) => {
    if (!loaded) return null;

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
                        color: "white",
                      }}
                      aria-label={`star ${item.title}`}
                    >
                      <StarBorderIcon />
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
      <ImageGrid images={uploadedImages} loaded={imagesFetched} />
    </div>
  );
};

export default App;
