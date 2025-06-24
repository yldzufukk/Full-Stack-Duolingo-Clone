import { cache } from "react";
import db from "./drizzle";


export const getCourses = cache(async () => {
  const data = db.query.courses.findMany();
  //empty
  return data;
});