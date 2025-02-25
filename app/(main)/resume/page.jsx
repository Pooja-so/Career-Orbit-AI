import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/ResumeBuilder";

const ResumePage = async () => {
  // fecthing resume from database
  const resume = await getResume();

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
};

export default ResumePage;
