import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import en from "../messages/en.json";
import ko from "../messages/ko.json";
import zh from "../messages/zh.json";

const messagesMap = {
  en,
  ko,
  zh,
};

export default getRequestConfig(async ({ requestLocale }) => {
  // 일반적으로 `[locale]` 세그먼트에 해당
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: messagesMap[locale as keyof typeof messagesMap],
  };
});
