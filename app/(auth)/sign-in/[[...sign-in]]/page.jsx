import { SignIn } from "@clerk/nextjs";

// [[..sign-in]] it is a catch route/optional route, it will catch the optional things in the url.
const SignInPage = () => {
  return <SignIn />;
};

export default SignInPage;
