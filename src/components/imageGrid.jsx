import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
// import GridList from "@material-ui/core/GridList";
// import GridListTile from "@material-ui/core/GridListTile";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import IconButton from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

function srcset(image, width, height, rows = 1, cols = 1) {
  return `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format 1x,
    ${image}?w=${width * cols}&h=${
    height * rows
  }&fit=crop&auto=format&dpr=2 2x`;
}

export const HeroImage = ({ images, loaded, index }) => {
  const [imageIndex, setImageIndex] = useState(index);

  if (!loaded) return null;
  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={images[imageIndex].url}
        alt={images[imageIndex].original_filename}
        loading="lazy"
        style={{ maxHeight: "400px", maxWidth: "100%" }}
      />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <button
          disabled={imageIndex < 1 ? true : false}
          onClick={() => (imageIndex > 0 ? setImageIndex(imageIndex - 1) : 0)}
        >
          <ArrowBackIosIcon />
        </button>

        <button
          disabled={imageIndex > images.length - 2 ? true : false}
          onClick={() =>
            imageIndex < images.length - 1
              ? setImageIndex(imageIndex + 1)
              : images.length - 1
          }
        >
          <ArrowForwardIosIcon />
        </button>
      </div>
    </div>
  );
};

const ImageGrid = ({
  images,
  favourites,
  loaded,
  imageUpdate,
  setFavourite,
  voteUp,
  voteDown,
  getVotes,
  votes,
  width,
  breakpoint,
}) => {
  if (!loaded) return null;

  const starClickHandler = (imageId, sub_id, isFavourite, favouriteId) => {
    setFavourite(imageId, sub_id, isFavourite, favouriteId);
    // imageUpdate();
  };

  const voteUpClickHandler = async (imageId, sub_id, votesValue) => {
    voteUp(imageId, sub_id, votesValue);
    //imageUpdate();
  };

  const voteDownClickHandler = async (imageId, sub_id, votesValue) => {
    voteDown(imageId, sub_id, votesValue);
    // imageUpdate();
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
      cols={width < breakpoint ? 2 : 4}
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
                      voteUpClickHandler(item.id, item.sub_id, imageVotesValue)
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

export default ImageGrid;
