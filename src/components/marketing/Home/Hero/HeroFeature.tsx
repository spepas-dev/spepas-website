const featureData = [
  {
    img: '/images/icons/icon-02.svg',
    title: 'Hassle-Free Returns',
    description: 'Easy exchanges guaranteed',
  },
  {
    img: '/images/icons/icon-03.svg',
    title: 'Secure Payments',
    description: '100% protected transactions',
  },
  {
    img: '/images/icons/icon-04.svg',
    title: '24/7 Support',
    description: 'Help anytime, anywhere',
  },
];

const HeroFeature = () => {
  return (
    <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 mt-8 sm:mt-10 lg:mt-14">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {featureData.map((item, key) => (
          <div
            key={key}
            className="flex items-center gap-4 bg-white rounded-xl px-5 py-5 shadow-1 border border-gray-3/50 hover:shadow-2 transition-shadow duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-light-5 flex-shrink-0">
              <img src={item.img} alt={item.title} width={28} height={28} />
            </div>
            <div>
              <h3 className="font-semibold text-dark text-sm sm:text-base">{item.title}</h3>
              <p className="text-dark-4 text-xs sm:text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;
