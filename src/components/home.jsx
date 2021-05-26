import { useHistory } from "react-router";
import { HeroImage } from "./imageGrid";
import ImageGrid from "./imageGrid";
import ErrorMessage from "./error";
import { Status } from "./error";

const Home = ({
  heroImageIndex,
  uploadedImages,
  imagesFetched,
  error,
  favourites,
  getUploadedFiles,
  setFavourite,
  voteUp,
  voteDown,
  getVotes,
  votes,
  width,
  breakpoint,
}) => {
  const history = useHistory();
  const UploadRouteClickHandler = () => {
    history.push("/upload");
  };

  return (
    <div>
      <HeroImage
        images={uploadedImages}
        loaded={imagesFetched}
        index={heroImageIndex}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <button style={{ width: "30%" }} onClick={UploadRouteClickHandler}>
          Upload a Cat
        </button>
      </div>

      <div style={{ margin: "8%" }}>
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
          width={width}
          breakpoint={breakpoint}
        />
      </div>
    </div>
  );
};
export default Home;
