import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Header } from "./header";
import { getUnits, getUserProgress } from "@/src/queries";
import { redirect } from "next/navigation";
import { units } from "@/src/schema";
import { Unit } from "./unit";

const LearnPage = async () => {

    const unitsData = getUnits();
    const userProgressData = getUserProgress();
    const [
        userProgress,
        units,
    ] = await Promise.all([userProgressData, unitsData,]);

    if (!userProgress || !userProgress.activeCourse){
        redirect("/courses")
    }

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress 
                    activateCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActivateSubscription={false}
                />
            </StickyWrapper>
            <FeedWrapper>
                <Header title={userProgress.activeCourse.title} />
                {units.map((unit) => (
                    <div key={unit.id} className="mb-10">
                        <Unit 
                            id={unit.id}
                            order={unit.order}
                            description={unit.description}
                            title={unit.title}
                            lessons={unit.lessons}
                            activeLesson={undefined}
                            activeLessonPercentage={0}
                        />
                    </div>
                ))}
            </FeedWrapper>
        </div>
    );
};

export default LearnPage;