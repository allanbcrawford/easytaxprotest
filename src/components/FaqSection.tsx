
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Easy Tax's mission?",
    answer: "Easy Tax's mission is to make the cost of real estate more clear and equitable by helping homeowners reduce their property tax bills through personalized tax appeal assistance."
  },
  {
    question: "How does the savings guarantee work?",
    answer: "If we do not save you money on your property taxes, there is no fee for our services. We only get paid if we successfully reduce your tax bill - that's our Savings-Or-Free guarantee."
  },
  {
    question: "How much does your service cost?",
    answer: "Our service is contingency-based, meaning we only get paid if we save you money. Our fee is typically a percentage of the tax savings we secure for you. The exact percentage depends on your property and location."
  },
  {
    question: "How much time will I need to spend on this process?",
    answer: "Very little! Most clients spend less than 10 minutes submitting their information. We handle all the paperwork, communications with tax authorities, and if necessary, represent you at hearings."
  },
  {
    question: "What information do I need to provide?",
    answer: "To get started, we only need your property address. Later in the process, we may request additional information about your property to strengthen your appeal."
  },
  {
    question: "In which locations do you provide service?",
    answer: "We currently provide service in most U.S. states. During the sign-up process, we'll confirm if we can assist with your specific property location."
  }
];

const FaqSection: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-gray-800">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
