import { getLesson, getUserProgress, getUserSubscription } from "@/src/queries";
import { redirect } from "next/navigation";
import { Quiz } from "./quiz";


const LessonPage = async () => {

    const lessonData = getLesson();
    const userProgressData = getUserProgress();
    const userSubscriptionData = getUserSubscription();

    const [
        lesson,
        userProgress,
        userSubscription,
    ] = await Promise.all([
        lessonData,
        userProgressData,
        userSubscriptionData,
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

export default LessonPage;