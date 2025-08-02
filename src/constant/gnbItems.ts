export const GEUST_NAVIGATION_ITEMS = [
  // 일반 유저
  { name: "navigation.findDriver", href: "/searchMover" },
];

export const CUSTOMER_NAVIGATION_ITEMS = [
  // 일반 유저
  { name: "navigation.estimateRequest", href: "/estimateRequest/create" },
  { name: "navigation.findDriver", href: "/searchMover" },
  { name: "navigation.myEstimateManagement", href: "/estimateRequest/pending" },
  { name: "navigation.myReviewManagement", href: "/review/writable" },
];

export const MOVER_NAVIGATION_ITEMS = [
  // 기사님
  { name: "navigation.receivedRequests", href: "/estimate/received" },
  { name: "navigation.myEstimateManagementDriver", href: "/estimate/request" },
  { name: "navigation.scheduleManagement", href: "/moverMyPage/schedule" },
];
