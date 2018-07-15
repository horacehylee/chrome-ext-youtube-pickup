export const isTesting = (): boolean => {
  return (
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV === "test"
  );
};
