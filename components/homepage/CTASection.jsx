/* CTA stands for Call to Action. 
 -> In web development and marketing, a CTA is a prompt that encourages users to take a 
    specific action, such as signing up, subscribing, or making a purchase. 
-> In your code, the CTA is prompting users to "Start Your Journey Today" by clicking the button. 
*/
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="w-full">
      <div className="mx-auto py-24 gradient rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
            Ready to Accelerate Your Career?
          </h2>
          <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl font-semibold">
            Join thousands of professionals who are advancing their careers with
            AI-powered guidance.
          </p>
          <Link href="/dashboard" passHref>
            <Button
              size="lg"
              variant="secondary"
              className="h-11 mt-5 animate-bounce text-sm md:text-base lg:text-lg xl:text-xl"
            >
              Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
