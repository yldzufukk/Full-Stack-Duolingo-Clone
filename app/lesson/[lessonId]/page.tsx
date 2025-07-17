import { getLesson, getUserProgress } from "@/src/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../quiz";

type Props = {
    params: {
        lessonId: number;
    };
};

const LessonIdPage = async ( {
    params,
} : Props) => {

    const lessonData = getLesson(params.lessonId);
    const userProgressData = getUserProgress();

    const [
        lesson,
        userProgress,
    ] = await Promise.all([
        lessonData,
        userProgressData
    ]);

    if (!lesson || !userProgress) {
        redirect("/learn");
    }

    const initialPercentage = lesson.challenges.filter((
        challange
    ) => challange.completed).length / lesson.challenges.length * 100;

    return (
        <Quiz 
            initialLessonId={lesson.id}
            initialLessonChallenges={lesson.challenges}
            initialHearts={userProgress.hearts}
            initialPercentage={initialPercentage}
            userSubsription={null}
        />
    );
};

export default LessonIdPage;