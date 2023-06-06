/*
IMPORTANT: Only use these filters if your class values are coming from metafields! Shopify theme settings already have key/value pairs, so these are NOT necessary when getting class data from those settings.
*/
export const overlayColorClass = (overlayColor) => {
  if (overlayColor === 'Light')
    return 'bg-white'
  if (overlayColor === 'Dark')
    return 'bg-black'
}
export const textColorClass = (color) => {
  if (color === 'Light')
    return 'color-white'
  if (color === 'Dark')
    return 'color-black'
}
export const textAlignClass = (alignment) => {
  if (alignment === 'Left')
    return 'text-left'
  if (alignment === 'Center')
    return 'text-center'
  if (alignment === 'Right')
    return 'text-right'
}
export const ctaClass = (cta) => {
  if (cta === 'Primary')
    return 'button button--primary'
  if (cta === 'Secondary')
    return 'button button--secondary'
}
export const linkColorClass = (overlayColor) => {
  if (overlayColor === 'Light')
    return 'color-black fill-black'
  if (overlayColor === 'Dark')
    return 'color-white fill-white'
}