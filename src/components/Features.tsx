import React from 'react';
import { Brain, Target, Lightbulb, BarChart as ChartBar, Users, Shield } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI Strategy',
      description: 'Develop a comprehensive AI strategy aligned with your business goals.'
    },
    {
      icon: Target,
      title: 'Implementation',
      description: 'Hands-on guidance for successful AI implementation in your organization.'
    },
    // {
    //   icon: Lightbulb,
    //   title: 'Innovation',
    //   description: 'Foster innovation and stay ahead with cutting-edge AI solutions.'
    // },
    {
      icon: ChartBar,
      title: 'Data Analytics',
      description: 'Transform your data into actionable insights with AI-powered analytics.'
    },
    {
      icon: Users,
      title: 'Team Training',
      description: 'Comprehensive training programs to upskill your entire team.'
    },
    // {
    //   icon: Shield,
    //   title: 'Best Practices',
    //   description: 'Industry-leading practices for responsible AI implementation.'
    // }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Vision Venture AI Academy</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive AI education and implementation support to help your business thrive in the digital age.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}