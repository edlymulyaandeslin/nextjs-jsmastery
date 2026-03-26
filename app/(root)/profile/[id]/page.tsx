import { auth } from "@/auth";
import AnswerCard from "@/components/cards/AnswerCard";
import QuestionCard from "@/components/cards/QuestionCard";
import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/Stats";
import UserAvatar from "@/components/UserAvatar";
import { EMPTY_ANSWERS, EMPTY_QUESTION, EMPTY_TAGS } from "@/constants/state";
import { getUser, getUserAnswers, getUserQuestions, getUserTopTags } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/global";
import dayjs from "dayjs";
import Link from "next/link";
import { notFound } from "next/navigation";

const Profile = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize } = await searchParams;

  if (!id) return notFound();

  const loggedInUser = await auth();

  const { success, data, errors } = await getUser({
    userId: id,
  });

  if (!success) {
    return (
      <div>
        <div className="h1-bold text-dark100_light900">{errors?.message}</div>
      </div>
    );
  }

  const { user, totalQuestions, totalAnswers } = data!;

  const [
    { success: userQuestionSuccess, data: userQuestions, errors: userQuestionsErrors },
    { success: userAnswersSuccess, data: userAnswers, errors: userAnswersErrors },
    { success: userTopTagsSuccess, data: userTopTags, errors: userTopTagsError },
  ] = await Promise.all([
    getUserQuestions({
      userId: id,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
    }),
    getUserAnswers({
      userId: id,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
    }),
    getUserTopTags({
      userId: id,
    }),
  ]);

  const { questions, isNext: hasMoreQuestions } = userQuestions!;

  const { answers, isNext: hasMoreAnswers } = userAnswers!;
  const { tags } = userTopTags!;

  const { _id, name, username, image, portfolio, location, createdAt, bio } = user;

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={_id}
            name={name}
            imageUrl={image}
            className="size-[140] rounded-full object-cover"
            fallbackClassname="text-6xl font-bold"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark200_light900">{name}</h2>
            <p className="paragraph-regular text-dark200_light800">@{username}</p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {portfolio && <ProfileLink imgUrl="/icons/link.svg" href={portfolio} title="Portfolio" />}

              {location && <ProfileLink imgUrl="/icons/location.svg" title="Location" />}

              <ProfileLink imgUrl="/icons/calendar.svg" title={dayjs(createdAt).format("MMMM YYYY")} />
            </div>

            {bio && <p className="paragraph-regular text-dark400_light800 mt-8">{bio}</p>}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedInUser?.user?.id === id && (
            <Link href={"/profile/edit"}>
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-44 px-4 py-3">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <Stats
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={{
          GOLD: 0,
          SILVER: 0,
          BRONZE: 0,
        }}
      />

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-2">
          <TabsList className="background-dark400_light900 min-h-[42] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts" className="mt-5 flex w-full flex-col gap-6">
            <DataRenderer
              data={questions}
              empty={EMPTY_QUESTION}
              success={userQuestionSuccess}
              errors={userQuestionsErrors}
              render={(questions) => (
                <div className="flex w-full flex-col gap-6">
                  {questions.map((question) => (
                    <QuestionCard
                      key={question._id}
                      question={question}
                      showActionBtns={loggedInUser?.user?.id === question.author._id}
                    />
                  ))}
                </div>
              )}
            />
            <Pagination page={page} isNext={hasMoreQuestions} />
          </TabsContent>

          <TabsContent value="answers" className="mt-5 flex w-full flex-col gap-6">
            <DataRenderer
              data={answers}
              empty={EMPTY_ANSWERS}
              success={userAnswersSuccess}
              errors={userAnswersErrors}
              render={(answers) => (
                <div className="flex w-full flex-col gap-6">
                  {answers.map((answer) => (
                    <AnswerCard
                      key={answer._id}
                      {...answer}
                      content={answer.content.slice(0, 27)}
                      containerClasses="card-wrapper rounded-[10] px-7 py-9 sm:px-11"
                      showReadMore
                      showActionBtns={loggedInUser?.user?.id === answer.author._id}
                    />
                  ))}
                </div>
              )}
            />
            <Pagination page={page} isNext={hasMoreAnswers} />
          </TabsContent>
        </Tabs>

        <div className="flex w-full min-w-[250] flex-1 flex-col max-lg:hidden">
          <h3 className="h3-bold text-dark200_light900">Top Tech</h3>
          <div className="mt-7 flex flex-col gap-4">
            <DataRenderer
              data={tags}
              empty={EMPTY_TAGS}
              success={userTopTagsSuccess}
              errors={userTopTagsError}
              render={(tags) => (
                <div className="flex w-full flex-col gap-6">
                  {tags.map((tag) => (
                    <TagCard key={tag._id} _id={tag._id} name={tag.name} question={tag.count} showCount compact />
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
