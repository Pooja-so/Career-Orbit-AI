import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnBoardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/DashboardView";

const DashboardPage = async () => {
  const { isOnboarded } = await getUserOnBoardingStatus();

  // If user is not onboarded, redirect it to onboarding page
  // Skip this process if already onboarded
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  // Fetch industru insights from the database
  const insights = await getIndustryInsights();

  // Display industry insights
  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  );
};

export default DashboardPage;
