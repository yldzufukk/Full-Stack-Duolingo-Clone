
"use server";

import db from "@/src/drizzle";
import { getCourseById, getUserProgress } from "@/src/queries";
import { challengeProgress, challenges, userProgress } from "@/src/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const POINTS_TO_REFILL = 10;

export const upsertUserProgress = async (courseId: number) => {
    const {userId} = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("Unauthorized");
    }

    const course = await getCourseById(courseId);

    if (!course) {
        throw new Error("Course not found");
    }

    //Enable once units and lessons are added
    //if (!course.units.length || !course.units[0].lessons.length) {
    //    throw new Error("Course is empty")
    //}

    const existingUserProgress = await getUserProgress();

    if(existingUserProgress) {
        await db.update(userProgress).set({
            activeCourseId: courseId,
            userName: user.firstName || "User",
            userImageSrc: user.imageUrl || "/mascot.svg",
        });
        
        revalidatePath("/courses");
        revalidatePath("/learn");
        redirect("/learn");
    }

    await db.insert(userProgress).values({
        userId,
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/mascot.svg",
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
};

export const reduceHearts = async (challengeId: number) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthroized");
    }

    const currentUserProgress = await getUserProgress();

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId),
    });

    if (!challenge) {
        throw new Error("Challenge not found");
    }

    const lessonId = challenge.lessonId;

    const existingChallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId),
        ),
    });

    const isPractise = !!existingChallengeProgress;

    if (isPractise){
        return {error : "practice"};
    }

    if (!currentUserProgress) {
        throw new Error("User progress not found");
    }

    if (currentUserProgress.hearts === 0) {
        return {error : "hearts"};
    }

    await db.update(userProgress).set({
        hearts: Math.max(currentUserProgress.hearts -  1, 0),
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/shop")
    revalidatePath("/learn")
    revalidatePath("/quests")
    revalidatePath("/leaderboard")
    revalidatePath(`/lesson/${lessonId}`)
};

export const refillHearts = async () => {
    const currentUserProgress = await getUserProgress();

    if(!currentUserProgress) {
        throw new Error("User progress not found");
    }

    if(currentUserProgress.hearts === 5){
        throw new Error("Hearts are already full");
    }

    if (currentUserProgress.points < POINTS_TO_REFILL){
        throw new Error("Not enough points");
    }

    await db.update(userProgress)
}