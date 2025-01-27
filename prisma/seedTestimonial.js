const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Testimonial Data
  const testimonials = [
    {
      name: "Goarang Gupta",
      designation: "Software Engineer",
      description: `As a Software Engineer at Pitney Bowes, Goarang made significant contributions in developing RESTful APIs using .NET Core Framework, improving frontend-backend communication by 40%. His expertise includes creating Graphics Management Systems.`,
    },
    {
      name: "Alice Johnson",
      designation: "Senior Developer",
      description: `Alice has been an outstanding contributor to our team. She helped redesign our application to be more efficient, cutting down load times by 60%. Her skill set includes React, Node.js, and cloud technologies.`,
    },
    {
      name: "Robert Smith",
      designation: "Project Manager",
      description: `Robert has successfully managed large-scale projects and has shown exceptional leadership. His dedication to meeting deadlines and managing teams efficiently is unmatched. He is also an expert in Agile methodologies.`,
    },
  ];

  // Add Testimonials
  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    });
  }

  console.log("Testimonial data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
