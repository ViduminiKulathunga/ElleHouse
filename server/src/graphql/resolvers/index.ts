import merge from "lodash.merge";
import { userResolvers } from "./User";
import { viewResolvers } from "./Viewer";
import { listingResolvers } from "./Listing";
import { bookingResolvers } from "./Booking";

export const resolvers = merge(
  userResolvers,
  viewResolvers,
  listingResolvers,
  bookingResolvers
);
