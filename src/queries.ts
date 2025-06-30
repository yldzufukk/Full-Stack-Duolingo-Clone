import { cache } from "react";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import db from "./drizzle";
import { challengeProgress, challenges, courses, lessons, units, userProgress } from "./schema";

export const getUserProgress = cache(async () => {
  const {userId} = await auth();
  
  if (!userId) {
    return null;
  }
  
  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });

  return data
});

export const getUnits = cache(async () =>  {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if ( !userId || !userProgress?.activeCourseId) {
    return [];
  }
  
  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId)
              },
            },
          },
        },
      },
    },
  });

  const normalizedData = data.map((unit) => {
    const lessonWithCompetedStatus = unit.lessons.map((lesson) => {
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress.every((progress) => progress.completed);
      });
      return { ...lesson, completed: allCompletedChallenges};
    })
    return { ...unit, lessons: lessonWithCompetedStatus}
  });
  return normalizedData;
});

export const getCourses = cache(async () => {
  const data = db.query.courses.findMany();
  
  return data;
});

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId)
  });
  return data;
})