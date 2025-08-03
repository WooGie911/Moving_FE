export const GEUST_NAVIGATION_ITEMS = [
  // 일반 유저
  { name: "findDriver", href: "/searchMover" },
];

export const CUSTOMER_NAVIGATION_ITEMS = [
  // 일반 유저
  { name: "estimateRequest", href: "/estimateRequest/create" },
  { name: "findDriver", href: "/searchMover" },
  { name: "myEstimateManagement", href: "/estimateRequest/pending" },
  { name: "myReviewManagement", href: "/review/writable" },
];

export const MOVER_NAVIGATION_ITEMS = [
  // 기사님
  { name: "receivedRequests", href: "/estimate/received" },
  { name: "myEstimateManagementDriver", href: "/estimate/request" },
  { name: "scheduleManagement", href: "/moverMyPage/schedule" },
];
