
"use client";

import { challengeOptions, challenges } from "@/src/schema";
import { useState } from "react";
import { Header } from "./header";

type Props = {
    initialPercentage: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];
    userSubsription: any;
};

export const Quiz = ( {
    initialPercentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubsription
}: Props) => {

    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercentage] = useState(initialPercentage);


    return (
        <>
            <Header 
                hearts={hearts}
                percentage={percentage}
                hasActiveSubscription={!!userSubsription?.isActive}
            />
        </>
    );
} ;