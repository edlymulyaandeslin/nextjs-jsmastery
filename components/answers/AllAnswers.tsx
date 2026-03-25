import { AnswerFilters } from "@/constants/filters";
import { EMPTY_ANSWERS } from "@/constants/state";
import { ActionResponse, Answer } from "@/types/global";
import DataRenderer from "../DataRenderer";
import AnswerCard from "../cards/AnswerCard";
import CommonFilter from "../filters/CommonFilter";

interface Props extends ActionResponse<Answer[]> {
  totalAnswers: number;
}

const AllAnswers = ({ data, success, errors, totalAnswers }: Props) => {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <CommonFilter filters={AnswerFilters} otherClasses="sm:min-w-32" containerClasses="max-xs:w-full" />
      </div>

      <DataRenderer
        data={data}
        errors={errors}
        success={success}
        empty={EMPTY_ANSWERS}
        render={(answers) => answers.map((answer) => <AnswerCard key={answer._id} {...answer} />)}
      />
    </div>
  );
};

export default AllAnswers;
