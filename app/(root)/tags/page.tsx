import { getTags } from "@/lib/actions/tag.action";

const Tags = async () => {
  const { success, data, errors } = await getTags({
    page: 1,
    pageSize: 10,
    query: "",
  });

  const { tags } = data || {};

  return <div>Tags</div>;
};

export default Tags;
