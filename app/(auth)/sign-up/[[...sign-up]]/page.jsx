import { SignUp } from "@clerk/nextjs";

// [[..sign-up]] it is a catch route/optional route, it will catch the optional things in the url.
const SignUpPage = () => {
  return <SignUp />;
};

export default SignUpPage;
