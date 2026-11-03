export function useSlugID() {
  let slug = useRoute().params.slug;
  if (!slug) throw createError({ status: 400 });
  if (typeof slug != "string") slug = slug.join("/");

  return slug.replace(/\/+$/, "");
}
