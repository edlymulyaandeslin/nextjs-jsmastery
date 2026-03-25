import AllAnswers from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metrix from "@/components/Metrix";
import SaveQuestion from "@/components/questions/SaveQuestion";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/Votes";
import ROUTES from "@/constants/routes";
import { getAnswers } from "@/lib/actions/answer.action";
import { hasSavedQuestion } from "@/lib/actions/collection.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { hasVoted } from "@/lib/actions/vote.action";
import { formatNumber, getTimestamp } from "@/lib/utils";
import { RouteParams, Tag } from "@/types/global";
import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { Suspense } from "react";

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  after(async () => {
    await incrementViews({ questionId: id });
  });

  const { success, data: question } = await getQuestion({ questionId: id });

  if (!success || !question) return redirect("/404");

  const {
    success: areAnswerLoaded,
    data: answersResult,
    errors: answersError,
  } = await getAnswers({
    questionId: id,
    page: 1,
    pageSize: 10,
    filter: "latest",
  });

  const hasVotedPromise = hasVoted({
    targetId: question._id,
    targetType: "question",
  });

  const hasSavedQuestionPromise = hasSavedQuestion({
    questionId: question._id,
  });

  const { author, createdAt, answers, views, tags, content } = question;

  return (
    <>
      <div className="flex-start flex flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author?._id}
              name={author?.name}
              className="size-[22]"
              imageUrl={author.image}
              fallbackClassname="text-[10]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">{author.name}</p>
            </Link>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                upvotes={question.upvotes}
                downvotes={question.downvotes}
                targetType={"question"}
                targetId={question._id}
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>

            <Suspense fallback={<div>Loading...</div>}>
              <SaveQuestion questionId={question._id} hasSavedQuestionPromise={hasSavedQuestionPromise} />
            </Suspense>
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">{question.title}</h2>
      </div>

      <div className="mt-5 mb-8 flex flex-wrap gap-4">
        <Metrix
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metrix
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={answers}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metrix
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <Preview content={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} _id={tag._id as string} name={tag.name} compact />
        ))}
      </div>

      <section className="my-5">
        <AllAnswers
          data={answersResult?.answers}
          success={areAnswerLoaded}
          errors={answersError}
          totalAnswers={Number(answersResult?.totalAnswers)}
        />
      </section>

      <section className="my-5">
        <AnswerForm questionId={question._id} questionTitle={question.title} questionContent={question.content} />
      </section>
    </>
  );
};

export default QuestionDetails;
