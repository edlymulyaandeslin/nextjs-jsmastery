import CommonFilter from "@/components/filters/CommonFilter";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { HomePageFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { RouteParams } from "@/types/global";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs",
  description: "This is all jobs requirements",
};

const Jobs = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h2-bold text-dark100_light900">Find Your Jobs</h1>
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.JOBS}
          imgSrc="/icons/search.svg"
          placeholder="Search jobs..."
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={HomePageFilters}
          otherClasses={"min-h-[56] sm:min-w-[170]"}
          containerClasses={"hidden max-md:flex"}
        />
      </section>
      <HomeFilter />

      {/* <DataRenderer
        success={success}
        errors={errors}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />

      <Pagination page={page} isNext={isNext || false} /> */}
    </>
  );
};

export default Jobs;
