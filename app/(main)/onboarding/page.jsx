import { industries } from "@/data/industries";

const OnboardingPage = () => {
  // Check if user is already onboarded
  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
};

export default OnboardingPage;
