export const withId = (prefix = "") => ({
  id: {
    type: String,
    default: () =>
      prefix +
      Math.random()
        .toString(16)
        .substring(2)
  }
});
