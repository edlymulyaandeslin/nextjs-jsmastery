import { Question as QuestionModel, Tag as TagModel } from "@/database";
import { GetTagQuestionsParams } from "@/types/action";
import { ActionResponse, ErrorResponse, PaginatedSearchParams, Question, Tag } from "@/types/global";
import { QueryFilter } from "mongoose";
import action from "../handlers/action";
import { handleError } from "../handlers/error";
import { GetTagQuestionsSchema, PaginatedSearchParamsSchema } from "../validation";

export const getTags = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ tags: Tag[]; isNext: boolean }>> => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const filterQuery: QueryFilter<typeof TagModel> = {};

  if (query) {
    filterQuery.$or = [
      {
        name: { $regex: query, $option: "i" },
      },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "recent":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name":
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalTags = await TagModel.countDocuments(filterQuery);

    const tags = await TagModel.find(filterQuery).sort(sortCriteria).skip(skip).limit(limit);

    const isNext = totalTags > skip + tags.length;

    return { success: true, data: { tags: JSON.parse(JSON.stringify(tags)), isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getTagQuestions = async (
  params: GetTagQuestionsParams
): Promise<ActionResponse<{ tag: Tag; questions: Question[]; isNext: boolean }>> => {
  const validationResult = await action({
    params,
    schema: GetTagQuestionsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { tagId, page = 1, pageSize = 10, query } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  try {
    const tag = await TagModel.findById(tagId);
    if (!tag) throw new Error("Tag not found");

    const filterQuery: QueryFilter<typeof QuestionModel> = {
      tags: { $in: [tagId] },
    };

    if (query) {
      filterQuery.title = { $regex: query, $option: "i" };
    }

    const totalQuestions = await QuestionModel.countDocuments(filterQuery);

    const questions = await QuestionModel.find(filterQuery)
      .select("_id title views answers upvotes downvotes author createdAt")
      .populate([
        { path: "author", select: "name image" },
        { path: "tags", select: "name" },
      ])
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
