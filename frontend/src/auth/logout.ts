export const logout = (): void => {
  localStorage.removeItem("token");
  window.location.reload();
};
