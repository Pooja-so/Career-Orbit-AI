/* Route group (auth) is used to provide common styling to both sign-in and sign-up page */
// sign-in and sign-up page are renderd in place of children
const AuthLayout = ({ children }) => {
  return <div className="flex justify-center pt-40">{children}</div>;
};
export default AuthLayout;
