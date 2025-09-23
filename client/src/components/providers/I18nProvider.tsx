// import "components/forms/yupErrorMessages";

import React, { useEffect, type FC, type PropsWithChildren } from "react";
import { IntlProvider } from "react-intl";
import enMessages from "translations/en.json";
import esMessages from "translations/es.json";

import { useLanguageStore } from "components/stores/LanguageStore";
import dayjs from "utils/dayjs";
import fallbackTranslations from "utils/translations/fallbackTranslations";

// import { LocaleContext } from "./LocaleProvider";

export const allMessages: Record<string, any> = {
  en: enMessages,
  es: esMessages,
};

const I18nProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  // in case there is untranslated message, fallback it to english
  const language = useLanguageStore((s) => s.language);
  const messages = fallbackTranslations(
    allMessages[language] || allMessages.en,
    allMessages[language],
  );

  // Set dayjs locale globally when language changes
  useEffect(() => {
    dayjs.locale(language);
  }, [language]);

  return (
    <IntlProvider locale={"en"} messages={messages}>
      {children}
    </IntlProvider>
  );
};

export default I18nProvider;
