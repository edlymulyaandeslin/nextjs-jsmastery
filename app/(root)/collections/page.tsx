import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { CollectionFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/state";
import { getSavedQuestions } from "@/lib/actions/collection.action";
import { RouteParams } from "@/types/global";

const Collections = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, errors } = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { collections } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h2-bold text-dark100_light900">Saved Questions</h1>
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COLLECTION}
          imgSrc="/icons/search.svg"
          placeholder="Search collections..."
          otherClasses="flex-1"
        />

        <CommonFilter filters={CollectionFilters} otherClasses="min-h-[56] sm:min-w-[170]" />
      </section>

      <DataRenderer
        success={success}
        errors={errors}
        data={collections}
        empty={EMPTY_QUESTION}
        render={(collections) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {collections.map((item) => (
              <QuestionCard key={item._id} question={item.question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Collections;
