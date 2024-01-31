export function getSearchStringFromObject(payload :any): string {
  return Object.keys(payload).reduce( (acc, key, index) => acc += (index > 0 ? `&${key}=${payload[key]}` : `${key}=${payload[key]}`), '?' )
}