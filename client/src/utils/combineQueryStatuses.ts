import type { MutationStatus, QueryStatus } from "@tanstack/react-query";

export const combineQueryStatuses = (
  statusArray: (QueryStatus | MutationStatus)[],
): QueryStatus | MutationStatus => {
  switch (true) {
    case statusArray.some((status) => status === "error"):
      return "error";

    case statusArray.some((status) => status === "loading"):
      return "loading";

    case statusArray.every((status) => status === "success"):
      return "success";

    default:
      return "idle";
  }
};
