"use server";

import { User as UserModel } from "@/database";
import { ActionResponse, ErrorResponse, PaginatedSearchParams, User } from "@/types/global";
import { QueryFilter } from "mongoose";
import action from "../handlers/action";
import { handleError } from "../handlers/error";
import { PaginatedSearchParamsSchema } from "../validation";

export async function getUsers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: User[]; isNext: boolean }>> {
  const validationResult = action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const filterQuery: QueryFilter<typeof UserModel> = {};

  if (query) {
    filterQuery.$or = [
      {
        name: { $regex: query, $options: "i" },
      },
      {
        username: { $regex: query, $options: "i" },
      },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalUsers = await UserModel.countDocuments(filterQuery);

    const users = await UserModel.find(filterQuery).sort(sortCriteria).skip(skip).limit(limit);

    const isNext = totalUsers > skip + users.length;

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
