import { faqs } from "@/data/faqs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";

const FAQSection = () => {
  return (
    <section className="w-full py-12 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about our platform
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="mb-4">
                <AccordionTrigger className="text-left text-sm md:text-base lg:text-lg xl:text-xl no-underline hover:no-underline accordion-trigger">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className=" text-muted-foreground text-sm md:text-base lg:text-lg xl:text-xl text-justify">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
