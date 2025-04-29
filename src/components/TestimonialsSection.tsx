
import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-2xl font-semibold text-gray-800">4.8</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400'}`} 
              />
            ))}
            <span className="text-gray-500 ml-2">(1,800+ Reviews)</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-1">
            <span className="text-primary">Tax Savings</span> <span className="text-secondary">Everyone</span>
          </h2>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Is Talking About
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <p className="text-gray-700 italic">
              "Couldn't have been easier. I just gave them my address and they took it from there. No filing appeals or spending hours to prepare for a hearing to defend my value. Easy Tax Protest does it all, no doubt better than I could have done myself. Saved $1500 on my property taxes. Highly recommend."
            </p>
          </div>
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/0db00bc8-df63-4a00-b41b-3a27da8ce18a.png" 
              alt="User portrait" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-4">
              <div className="font-semibold text-gray-800">Jacob Jones</div>
              <div className="text-gray-500 text-sm">Marketing Coordinator</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
