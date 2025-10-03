export const secretProjectsPageText = {
  introduction:
    'Congratulation! You have found my secret list of projects. Here I talk about story projects and silly ideas that have contributed to my experiences as a developer but are not serious enough for the main page. I hope you enjoy as much as me.',
  meetMyGirlFriend:
    'Meet my high school sweetheart and love of my life, Jennifer <3. The only reason I need to be the best version of myself.',
};

export const secretProjects = [
  {
    title: 'Can I have My Phone?',
    languages: ['React', 'JavaScript', 'HTML', 'CSS'],
    description:
      'Ask the Magic Conshell if you can have your phone and watch it ruin your night! A joke between my lovely girlfriend and I after her little brother kept asking to get his phone back at night, claiming he will not stay awake late...yeahhh right. Go to sleep Jay!',
    // mediaSrc: StudioVaultImg,
    imagealt: 'Screenshot of Can I have My Phone?',
    url: 'http://localhost:3000/SecretProjects/CanIHaveMyPhone',
    status: 'live',
    page: '/canihavemyphone',
    projectPurpose: 'story',
  },
  {
    title: 'Is It Water?',
    languages: ['React', 'JavaScript', 'HTML', 'CSS'],
    description:
      "One of my CS course finals at Sierra College was to create a GUI using an API. I had an amazingly simple idea...put input coordinates and be told wheather it is water or not water. One of my brothers, Camryn, for this project made a GUI that would convert USD into all major currencies but he did't even loop through a map to develop it faster. He did every currency manually and plugged in each exchange rate from the API with individual variables. He was butthurt that I got full points for significaly less work, all our friends praise it. :) ",
    // mediaSrc: StudioVaultImg,
    imagealt: 'Water or not water',
    url: 'http://localhost:3000/waterornotwater',
    status: 'live',
    // page: '/canihavemyphone',
    projectPurpose: 'story',
  },
];
