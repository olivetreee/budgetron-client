export const CATEGORY_ICON = {
  "MISSING CATEGORY": "fa-file-circle-question-",
  "Others": "fa-shopping-bag",
  "Entertainment": "fa-film",
  "Utilities": "fa-plug",
  "Eat Out": "fa-utensils",
  "Internet": "fa-wifi",
  "Market": "fa-shop",
  "Chewie": "fa-dog",
  "Health": "fa-stethoscope",
  "Transportation": "fa-train-subway",
  "Childcare": "fa-children",
  "Gas": "fa-gas-pump"
}

export const PAGE_DATA = {
  dashboard: {
    path: '/dashboard',
    name: "Dashboard",
    icon: "fa-gauge",
  },
  fixVendors: {
    path: '/fix-vendors',
    name: "Fix Vendors",
    icon: "fa-circle-question",
  },
  categories: {
    path: '/categories',
    name: "Categories",
    icon: "fa-dollar-sign",
  },
  transactions: {
    path: '/transactions',
    name: "Transactions",
    icon: "fa-credit-card",
    hideFromNav: true,
  },
}

export const BASE_API_URL = "https://yc323wz0jd.execute-api.us-west-2.amazonaws.com";