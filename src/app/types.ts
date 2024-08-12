export type UserAccountType = "student" | "coach";

export type WithId<T extends object = {}> = T & { _id: string };

export type ApiResponse<T> = ["ok", T] | ["error", string];
