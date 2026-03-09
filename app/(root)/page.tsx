import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title: "How to learn react?",
    description: "I want to learn react, but i dont know how to start!",
    tags: [
      { _id: "1", name: "react" },
      { _id: "2", name: "javascript" },
    ],
    author: { _id: "1", name: "John Doe" },
    upvotes: 10,
    answer: 5,
    views: 100,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "How to learn javascript?",
    description: "I want to learn javascript, but i dont know how to start!",
    tags: [
      { _id: "1", name: "javascript" },
      { _id: "2", name: "javascript" },
    ],
    author: { _id: "1", name: "John Doe" },
    upvotes: 10,
    answer: 5,
    views: 100,
    createdAt: new Date(),
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  const { query = "", filter = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title.toLocaleLowerCase().includes(query?.toLocaleLowerCase());
    const matchesFilter = filter ? question.tags[0].name?.toLowerCase() === filter.toLowerCase() : true;

    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h2-bold text-dark100_light900">All Questions</h1>

        <Button className="primary-gradient text-light-900! min-h-[46] px-4 py-3" asChild>
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>

      <section className="mt-11">
        <LocalSearch route="/" imgSrc="/icons/search.svg" placeholder="Search questions..." otherClasses="flex-1" />
      </section>

      <HomeFilter />

      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <h1 key={question._id}>{question.title}</h1>
        ))}
      </div>
    </>
  );
};

export default Home;
