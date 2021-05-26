const ErrorMessage = ({ error }) => {
  console.log("errror", error);
  return (
    <span>
      <h4>{error.error_message}</h4>
    </span>
  );
};

export const Status = ({ message }) => (
  <span>
    <h4>{message}</h4>
  </span>
);
export default ErrorMessage;
