import { useHistory } from "react-router";

const ImageUploadForm = ({ disable, uploadFile, onFilePicked, uploading }) => {
  const history = useHistory();
  return (
    <div
      style={{
        margin: "5%",
        padding: "2%",
        border: "1px solid black",
      }}
    >
      <div
        style={{
          position: "relative",
          left: "35%",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
          disabled={disable}
          onClick={() => {
            uploadFile();
            history.push("/");
          }}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

const Upload = ({ uploadFileReady, uploadFile, onFilePicked }) => {
  return (
    <ImageUploadForm
      disable={!uploadFileReady}
      uploadFile={uploadFile}
      onFilePicked={onFilePicked}
    />
  );
};

export default Upload;
