/**
 * Fallback translations values to default translations language where parameter is equal null;
 * @param translations
 * @param defaultTranslations
 */

type ITranslation = Record<string, any>;

const fallbackTranslations = (
  translations: ITranslation,
  defaultTranslations: ITranslation,
) =>
  Object.keys(translations).reduce((prev: any, key: string) => {
    if (translations[key] && typeof translations[key] === "object") {
      prev[key] = fallbackTranslations(
        translations[key],
        defaultTranslations[key],
      );
    } else if (!translations[key]) {
      prev[key] = defaultTranslations[key];
    } else {
      prev[key] = translations[key];
    }
    return prev;
  }, {});

export default fallbackTranslations;
