import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

export const TaskHistoryAggregate = (id: string) => [
  {
    $match: {
      createdBy: new ObjectId(id),
    },
  },
  {
    $group: {
      _id: "$createdBy",
      totalTasks: {
        $sum: 1,
      },
      totalPending: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", 1],
            },
            1,
            0,
          ],
        },
      },
      totalOngoing: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", 2],
            },
            1,
            0,
          ],
        },
      },
      totalCompleted: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", 3],
            },
            1,
            0,
          ],
        },
      },
    },
  },
];
