import type { Post } from "../prisma/queries";
import PostEntry from "./common/PostEntry";

type FeedbackPostProps = {
  data: Post;
  withAuthor?: boolean;
};

const FeedbackPost = ({ data, withAuthor }: FeedbackPostProps) => {
  return (
    <PostEntry data={data} withAuthor={withAuthor}>
      <PostEntry.Header />
      <PostEntry.Body />
      <PostEntry.Footer />
    </PostEntry>
  );
};

export default FeedbackPost;
