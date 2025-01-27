const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  
  // Demo Users Data
  const demoUsers = [
    {
      email: "goarang.gupta@example.com",
      name: "Goarang Gupta",
      experience: "1 year",
      notice: "16 to 30 days",
      currentCTC: "₹16LPA",
      workedAt: "Pitney Bowes",
      description: `As a Software Engineer at Pitney Bowes, Goarang made significant contributions in developing RESTful APIs using .NET Core Framework, improving frontend-backend communication by 40%. His expertise includes creating Graphics Management Systems.`,
      skills: ["RESTful APIs", ".NET Core Framework", "Graphics Management Systems", "Frontend-Backend Communication"],
    },
    {
      email: "john.doe@example.com",
      name: "John Doe",
      experience: "3 years",
      notice: "Immediate",
      currentCTC: "₹20LPA",
      workedAt: "Google",
      description: `John has been a leading contributor in developing scalable backend systems at Google. He specializes in cloud-native applications and serverless architecture.`,
      skills: ["Cloud-Native", "Serverless Architecture", "Backend Development", "Python", "Google Cloud"],
    },
    {
      email: "jane.smith@example.com",
      name: "Jane Smith",
      experience: "5 years",
      notice: "30 days",
      currentCTC: "₹25LPA",
      workedAt: "Amazon",
      description: `At Amazon, Jane has architected and optimized e-commerce solutions, improving checkout efficiency by 25%. She is skilled in large-scale distributed systems.`,
      skills: ["Distributed Systems", "E-Commerce", "AWS", "Java", "Microservices"],
    },
    {
      email: "alex.jones@example.com",
      name: "Alex Jones",
      experience: "2 years",
      notice: "15 days",
      currentCTC: "₹12LPA",
      workedAt: "Facebook",
      description: `Alex developed core components of Facebook's social media platform, focusing on user engagement features. He is adept at React.js and GraphQL.`,
      skills: ["React.js", "GraphQL", "Frontend Development", "UI/UX", "JavaScript"],
    },
    {
      email: "emma.brown@example.com",
      name: "Emma Brown",
      experience: "4 years",
      notice: "45 days",
      currentCTC: "₹18LPA",
      workedAt: "Microsoft",
      description: `Emma has contributed to Microsoft Office Suite's AI integration, improving user productivity tools by leveraging machine learning techniques.`,
      skills: ["AI Integration", "Machine Learning", "C#", ".NET Framework", "Productivity Tools"],
    },
  ];

  // Add Users
  for (const user of demoUsers) {
    await prisma.user.create({
      data: user,
    });
  }


  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
