/**
 * Composable for displaying localized dynamic content from Supabase.
 * For CMS content that has _ru suffix columns (e.g., title_ru, description_ru),
 * this helper returns the correct field based on current locale.
 */
export const useLocalizedContent = () => {
  const { locale } = useI18n()

  /**
   * Get the localized value of a field from a CMS item.
   * If locale is 'ru', it looks for item[field + '_ru'] first.
   * Falls back to item[field] (English) if the localized version is empty.
   */
  const localField = (item: Record<string, any>, field: string): string => {
    if (locale.value === 'ru') {
      const ruValue = item[`${field}_ru`]
      if (ruValue && ruValue.trim()) return ruValue
    }
    return item[field] || ''
  }

  return { localField, locale }
}
