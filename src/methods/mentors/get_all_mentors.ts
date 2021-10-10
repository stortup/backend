import { usersCollection } from "../../collections/users";

function getAllMentors(page = 0) {
  return usersCollection
    .find({ is_mentor: true, is_available: true })
    .limit(20)
    .skip(page * 20)
    .toArray();
}
