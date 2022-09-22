import { postUser } from "../../app/features/reqres/reqresSlice";
import { useAppDispatch } from "../../app/hooks";

const Data = () => {
  const dispatch = useAppDispatch();

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          dispatch(
            postUser({
              job: "Computer Scientist",
              name: "Alan Turing",
            })
          );
        }}
      >
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Data;
