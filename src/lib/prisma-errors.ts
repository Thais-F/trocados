import { Prisma } from "@/generated/prisma/client";

/**
 * True when a write failed because it referenced a row that no longer
 * exists (e.g. a JWT session pointing at a user that was deleted from
 * under it — the token is still validly signed, but the user row is gone).
 */
export function isForeignKeyError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003"
  );
}
