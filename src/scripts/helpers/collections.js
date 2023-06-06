export const STATE_SESSION_STORAGE_KEY = 'BVA-collection-state-map';

export const getCollectionCacheState = (handle) => {
  let cacheState = sessionStorage.getItem(STATE_SESSION_STORAGE_KEY) || false;

  if (!cacheState) return false;

  cacheState = JSON.parse(cacheState);
  return cacheState[handle];
};
