import ROUTES from "@/constants/routes";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import DataRenderer from "../DataRenderer";
import TagCard from "../cards/TagCard";

const RightSidebar = async () => {
  const [{ success, data: hotQuestions, errors }, { success: tagSuccess, data: popularTags, errors: tagErrors }] =
    await Promise.all([getHotQuestions(), getTopTags()]);

  return (
    <section className="custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 right-0 flex h-screen w-[350] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 max-xl:hidden dark:shadow-none">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <DataRenderer
          data={hotQuestions}
          empty={{
            title: "No questions found",
            message: "No question have been asked yet",
          }}
          success={success}
          errors={errors}
          render={(hotQuestions) => (
            <div className="mt-7 flex w-full flex-col gap-[30]">
              {hotQuestions.map(({ _id, title }) => (
                <Link
                  href={ROUTES.QUESTION(_id)}
                  key={_id}
                  className="flex cursor-pointer items-center justify-between gap-7"
                >
                  <p className="body-medium text-dark500_light700 line-clamp-2">{title}</p>

                  <Image
                    src={"/icons/chevron-right.svg"}
                    alt="chevron"
                    width={20}
                    height={20}
                    className="invert-colors"
                  />
                </Link>
              ))}
            </div>
          )}
        />
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>

        <DataRenderer
          data={popularTags}
          empty={{
            title: "No tags found",
            message: "No tag have been created yet",
          }}
          success={tagSuccess}
          errors={tagErrors}
          render={(popularTags) => (
            <div className="mt-7 flex flex-col gap-4">
              {popularTags.map(({ _id, name, question }) => (
                <TagCard key={_id} _id={_id} name={name} question={question} showCount compact />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSidebar;
