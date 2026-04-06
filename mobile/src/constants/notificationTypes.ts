export const NOTIFICATION_TYPES = ["inactive-users"] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
