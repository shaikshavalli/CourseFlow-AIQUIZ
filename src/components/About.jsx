import React from 'react'
function About() {

  const features = [
    {
      title: "AI Quiz",
      description:
        "Challenge yourself with AI-powered quizzes that are automatically generated from uploaded PDFs. Get instant results, detailed analysis, and improve your weak areas.",
      image:
        "https://cdni.iconscout.com/illustration/premium/thumb/boy-giving-online-quiz-illustration-svg-download-png-8153626.png", 
    },
    {
      title: "E-Books",
      description:
        "Access a huge library of e-books across various subjects. Read anytime, anywhere with a smooth and optimized reading experience.",
      image:
        "https://cdn3d.iconscout.com/3d/premium/thumb/book-3d-icon-png-download-8027322.png",
    },
    {
      title: "Online Study",
      description:
        "Interactive online study resources with notes, explanations, and practice problems to make your learning more effective and engaging.",
      image:
        "https://cdni.iconscout.com/illustration/premium/thumb/boy-doing-exam-preparations-illustration-svg-png-download-8991272.png",
    },
    {
      title: "Responsive Design",
      description:
        "Enjoy a seamless experience on mobile, tablet, or desktop. Our platform adapts to every screen, so you can study without limits.",
      image:
        "https://freepngimg.com/thumb/responsive_web_design/72921-development-web-wireframe-up-website-design-responsive-thumb.png", 
    },
  ];

  
  return (
    <div className="min-h-screen py-16 px-6 bg-gray-100 dark:bg-slate-900 dark:text-white">

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-3">About CourseFlow</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          CourseFlow is your all-in-one learning companion. From AI quizzes to
          e-books and responsive online study tools, we are redefining the way
          you learn and prepare.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl shadow-md bg-white dark:bg-slate-800 hover:shadow-lg transition flex flex-col items-center text-center"
          >
            <img
              src={feature.image}
              alt={feature.title}
              className="w-32 h-32 object-contain mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>

  )
}

export default About