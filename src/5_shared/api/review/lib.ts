
export const validReviewServerQueryKeys = ['place_id', 'period_from', 'period_to', 'order_by', 'descending', 'page', 'size'];

export function normalizeReviewQuery(query: Dictionary<any>): Dictionary<string> {
  return Object.entries(query).reduce<Dictionary<string>>((acc, [key, value]) => {
    if (value != null && value !== '') {
      acc[key] = value;
    }

    return acc;
  }, {});
}
