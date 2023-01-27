import merge from "lodash.merge";
import { userResolvers } from "./User";
import { viewResolvers } from "./Viewer";

export const resolvers = merge(userResolvers, viewResolvers);
