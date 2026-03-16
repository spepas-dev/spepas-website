export type Testimonial = {
  review: string;
  authorName: string;
  authorRole: string;
  authorImg: string;
};

const testimonialsData: Testimonial[] = [
  {
    review:
      'I needed a radiator for my Hyundai Tucson and found it on SpePas within minutes. The seller was verified, the part was genuine, and it arrived the next day. Way easier than driving around Abossey Okai.',
    authorName: 'John Kwabena',
    authorImg: '/images/users/user1.jpg',
    authorRole: 'Car Owner'
  },
  {
    review:
      'As a delivery rider, I can\'t afford downtime. SpePas helped me source brake pads and a chain set fast. The request feature is great — I posted what I needed and got offers within hours.',
    authorName: 'Wilson Addai',
    authorImg: '/images/users/user2.jpg',
    authorRole: 'Delivery Rider'
  },
  {
    review:
      'I manage a fleet of 12 vehicles and SpePas has become my go-to for sourcing parts. Being able to compare prices from multiple sellers in one place saves me time and money every week.',
    authorName: 'Miracle Addo',
    authorImg: '/images/users/user3.jpg',
    authorRole: 'Fleet Manager'
  },
  {
    review:
      'My customers always need parts urgently. With SpePas I can search, order, and have parts delivered to my workshop without leaving the shop. It\'s changed how I run my business.',
    authorName: 'Thomas Osei Quansah',
    authorImg: '/images/users/user4.jpg',
    authorRole: 'Workshop Owner'
  },
  {
    review:
      'I sell used parts from my shop in Kumasi. Listing on SpePas has brought me buyers from Accra, Takoradi, even Tamale. The platform is simple and the payments are secure.',
    authorName: 'Daniel Mensah',
    authorImg: '/images/users/user5.jpg',
    authorRole: 'Parts Seller'
  },
  {
    review:
      'I\'ve been a mechanic for 15 years and sourcing quality parts has always been the hardest part of the job. SpePas makes it easy to find exactly what I need with photos and seller ratings.',
    authorName: 'Samuel Baffoe',
    authorImg: '/images/users/user6.jpg',
    authorRole: 'Mechanic'
  }
];

export default testimonialsData;
