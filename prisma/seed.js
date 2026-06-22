const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const events = [
    {
      title: "Introduction to Tensor Processing Units (TPUs)",
      description:
        "Deepak Singh, SWE 3 at Google and previously SDE 2 at Uber and Microsoft plus SDE Intern at Amazon, will introduce Tensor Processing Units, why they matter for modern machine learning workloads, how they differ from GPUs, and when builders should consider using them for training or inference.",
      imageUrl: "https://fbxzb7sb0uusum4k.public.blob.vercel-storage.com/event1",
      location: "Online",
      startsAt: new Date("2026-06-22T17:30:00.000Z"),
      endsAt: new Date("2026-06-22T18:30:00.000Z"),
      published: true,
    },
  ];

  for (const event of events) {
    const existingEvent = await prisma.event.findFirst({
      where: { title: event.title },
      select: { id: true },
    });

    if (existingEvent) {
      await prisma.event.update({
        where: { id: existingEvent.id },
        data: event,
      });
    } else {
      await prisma.event.create({ data: event });
    }
  }

  // Seed a recommender user (Navneet Bhaiya)
  const recommender = await prisma.user.upsert({
    where: { email: "navneet@agora.org" },
    update: {},
    create: {
      email: "navneet@agora.org",
      name: "navneet bhaiya",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const bookshelfData = [
    {
      name: "System Design",
      slug: "system-design",
      resources: [
        {
          title: "Designing Data-Intensive Applications",
          author: "Martin Kleppmann",
          type: "BOOK",
          recommendationReason:
            "The bible of system design. It teaches you the fundamental principles behind distributed systems, data storage, and processing.",
          resourceLink: "https://dataintensive.net/",
          buyLink:
            "https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321",
          imageUrl: "https://images-na.ssl-images-amazon.com/images/I/91tA4t2yA9L.jpg",
        },
        {
          title: "System Design Primer",
          author: "Donne Martin",
          type: "ARTICLE",
          recommendationReason:
            "An amazing open-source repository containing everything you need to know to prepare for system design interviews.",
          resourceLink: "https://github.com/donnemartin/system-design-primer",
          buyLink: null,
          imageUrl:
            "https://raw.githubusercontent.com/donnemartin/system-design-primer/master/images/system_design_primer.png",
        },
        {
          title: "System Design Interview – An insider's guide",
          author: "Alex Xu",
          type: "BOOK",
          recommendationReason:
            "A highly practical guide focusing on real-world system design interview questions with step-by-step solutions.",
          resourceLink: "https://bytebytego.com/",
          buyLink: "https://www.amazon.com/System-Design-Interview-insiders-guide/dp/B08B3FWY9V",
          imageUrl: "https://images-na.ssl-images-amazon.com/images/I/41O9ZcuK7HL.jpg",
        },
      ],
    },
    {
      name: "Operating Systems",
      slug: "operating-systems",
      resources: [
        {
          title: "Operating Systems: Three Easy Pieces",
          author: "Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau",
          type: "BOOK",
          recommendationReason:
            "A free, brilliant introduction to modern operating systems, covering virtualization, concurrency, and persistence in great detail.",
          resourceLink: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
          buyLink: "https://www.amazon.com/Operating-Systems-Three-Easy-Pieces/dp/1982065306",
          imageUrl: "https://images-na.ssl-images-amazon.com/images/I/41S7mO4W97L.jpg",
        },
        {
          title: "Modern Operating Systems",
          author: "Andrew S. Tanenbaum",
          type: "BOOK",
          recommendationReason:
            "A classic academic textbook that covers operating system design principles, with detailed explanations of processes, memory, and file systems.",
          resourceLink:
            "https://www.pearson.com/en-us/subject-catalog/p/modern-operating-systems/P200000003295/9780137618880",
          buyLink: "https://www.amazon.com/Modern-Operating-Systems-Andrew-Tanenbaum/dp/013359162X",
          imageUrl: "https://images-na.ssl-images-amazon.com/images/I/51wXpMv-KNL.jpg",
        },
        {
          title: "Crash Course Computer Science - Operating Systems",
          author: "Carrie Anne Philbin",
          type: "VIDEO",
          recommendationReason:
            "A high-level, extremely engaging 10-minute explanation of what an operating system actually does under the hood.",
          resourceLink: "https://www.youtube.com/watch?v=26QPDBe-q4U",
          buyLink: null,
          imageUrl: "https://img.youtube.com/vi/26QPDBe-q4U/hqdefault.jpg",
        },
      ],
    },
    {
      name: "OOP",
      slug: "oop",
      resources: [
        {
          title: "Design Patterns: Elements of Reusable Object-Oriented Software",
          author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
          type: "BOOK",
          recommendationReason:
            "The original GoF (Gang of Four) patterns book. A must-read for understanding how to design flexible, reusable object-oriented software.",
          resourceLink: "https://www.oreilly.com/library/view/design-patterns-elements/0201633612/",
          buyLink:
            "https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612",
          imageUrl: "https://images-na.ssl-images-amazon.com/images/I/51szD9HC9pL.jpg",
        },
        {
          title: "Head First Design Patterns",
          author: "Eric Freeman, Elisabeth Robson",
          type: "BOOK",
          recommendationReason:
            "A visually rich, highly engaging guide to design patterns. Excellent for beginners who want to learn OOP principles without getting bogged down in dry theory.",
          resourceLink: "https://www.oreilly.com/library/view/head-first-design/9781492077992/",
          buyLink: "https://www.amazon.com/Head-First-Design-Patterns-Brain-Friendly/dp/149207800X",
          imageUrl: "https://images-na.ssl-images-amazon.com/images/I/51V1T418sFL.jpg",
        },
        {
          title: "Elegant Objects",
          author: "Yegor Bugayenko",
          type: "BOOK",
          recommendationReason: null, // Test optional recommendationReason
          resourceLink: null, // Test optional resourceLink
          buyLink: "https://www.amazon.com/Elegant-Objects-Yegor-Bugayenko/dp/1519166915",
          imageUrl: "https://images-na.ssl-images-amazon.com/images/I/41-qSgHlS-L.jpg",
        },
      ],
    },
    {
      name: "Architecture",
      slug: "architecture",
      resources: [
        {
          title: "Clean Architecture",
          author: "Robert C. Martin",
          type: "BOOK",
          recommendationReason:
            "Presents the universal rules of software architecture. Teaches how to keep business logic separate from delivery mechanisms (web, database).",
          resourceLink: "https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/",
          buyLink:
            "https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164",
          imageUrl: "https://images-na.ssl-images-amazon.com/images/I/41-sN-mzwKL.jpg",
        },
        {
          title: "Software Architecture Patterns",
          author: "Mark Richards",
          type: "BOOK",
          recommendationReason:
            "A concise, free O'Reilly report covering layered, event-driven, microservices, space-based, and microkernel architectures.",
          resourceLink:
            "https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/",
          buyLink: null,
          imageUrl: "https://images-na.ssl-images-amazon.com/images/I/51N-9Z73nGL.jpg",
        },
        {
          title: "Grokking Simplicity",
          author: "Eric Normand",
          type: "BOOK",
          recommendationReason:
            "Although functionally oriented, it offers brilliant insights into modular software design, separating actions, calculations, and data.",
          resourceLink: "https://www.manning.com/books/grokking-simplicity",
          buyLink:
            "https://www.amazon.com/Grokking-Simplicity-software-functional-thinking/dp/1617296201",
          imageUrl: "https://images-na.ssl-images-amazon.com/images/I/41T2a0Pj4yL.jpg",
        },
      ],
    },
  ];

  for (const categoryData of bookshelfData) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: { name: categoryData.name },
      create: {
        name: categoryData.name,
        slug: categoryData.slug,
      },
    });

    for (const res of categoryData.resources) {
      const existingResource = await prisma.resource.findUnique({
        where: {
          categoryId_title: {
            categoryId: category.id,
            title: res.title,
          },
        },
      });

      const resourceData = {
        title: res.title,
        author: res.author,
        type: res.type,
        recommendationReason: res.recommendationReason,
        resourceLink: res.resourceLink,
        buyLink: res.buyLink,
        imageUrl: res.imageUrl,
        categoryId: category.id,
        recommendedById: recommender.id,
      };

      if (existingResource) {
        await prisma.resource.update({
          where: { id: existingResource.id },
          data: resourceData,
        });
      } else {
        await prisma.resource.create({
          data: resourceData,
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
