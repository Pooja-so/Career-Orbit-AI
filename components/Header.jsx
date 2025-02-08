import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
const Header = () => {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      {/* 1. If user has signed out then clerk will display SignIn and SignUp button */}
      <SignedOut>
        <SignInButton />
      </SignedOut>
      {/* 2. If user is already signed in then clerk will display Userbutton*/}
      <SignedIn>
        <UserButton showName />
      </SignedIn>
    </header>
  );
};

export default Header;
