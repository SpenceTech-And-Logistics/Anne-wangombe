// Built-in content, from the State Department for Gender and Affirmative Action, the National Police Service
// leadership page, MIGECAH, and Kenya News Agency. The dashboard (Firebase) overrides any of this.

export const CATEGORIES = ['Women empowerment', 'GBV response', 'Affirmative action', 'Policy and law', 'Community', 'Other']
export const NEWS_CATEGORIES = ['Press coverage', 'Statements', 'Department news', 'Recognition']
export const GALLERY_CATEGORIES = ['Events', 'Field visits', 'Official', 'Community']

export const defaults = {
  profile: {
    name: "Anne Wang'ombe",
    firstName: 'Anne',
    lastName: "Wang'ombe",
    fullName: "Anne Njoki Wang'ombe",
    role: 'Principal Secretary',
    department: 'State Department for Gender and Affirmative Action',
    ministry: 'Ministry of Gender, Culture, the Arts and Heritage',
    intro:
      'A human resource professional and educationist with more than three decades of experience in business development and capacity building, now leading Kenya’s work on gender equality, women’s empowerment and affirmative action.',
    headline:
      "**Ms. Anne Njoki Wang’ombe**, Principal Secretary for Gender and Affirmative Action, is an accomplished public sector executive with over three decades of experience in public administration, institutional leadership and strategic management. She previously served as Principal Secretary for Performance Management and Delivery Services and has held senior leadership positions at the Kenya Medical Research Institute (KEMRI), Kenya Revenue Authority Staff Pension Scheme and other institutions. Her career reflects extensive experience in governance, institutional transformation, public service delivery and policy implementation. In her current role, she leads national initiatives advancing gender equality, women’s economic empowerment, affirmative action and inclusive development.",
    facts: [
      { label: 'Current office', value: 'Principal Secretary, State Department for Gender and Affirmative Action' },
      { label: 'Ministry', value: 'Gender, Culture, the Arts and Heritage' },
      { label: 'Background', value: 'Human resources and education, 30+ years' },
      { label: 'Based in', value: 'Nairobi, Kenya' },
    ],
    bio: [
      "Anne Wang'ombe is the Principal Secretary of the State Department for Gender and Affirmative Action in Kenya's Ministry of Gender, Culture, the Arts and Heritage. She oversees policies and programmes that promote gender equity, women's empowerment and affirmative action for disadvantaged groups.",
      'She is a professional human resource manager and educationist, passionate about talent management, coaching and nurturing teamwork. Her career spans the Kenya Revenue Authority Staff Pension Scheme, the Kenya Medical Research Institute and a number of universities and teachers colleges, and she describes a deep commitment to advancing the rights of marginalised communities.',
    ],
    sworn: 'Sworn in as Principal Secretary on 4 July 2023',
    photo: '',
    homeAboutPhoto: '',
    aboutPhoto: '',
    interests: ['Gender equality', "Women's empowerment", 'Affirmative action', 'Ending GBV', 'Capacity building', 'Inclusion'],
    positions: [
      {
        when: 'Current',
        title: 'Principal Secretary, State Department for Gender and Affirmative Action',
        detail: 'Ministry of Gender, Culture, the Arts and Heritage. Sworn in on 4 July 2023.',
      },
      { when: '', title: 'Manager, Kenya Revenue Authority Staff Pension Scheme (KRASPA)', detail: 'Scheme fund management for a large national organisation.' },
      {
        when: '',
        title: 'Assistant Director, Human Resources and Administration, KEMRI',
        detail: 'Kenya Medical Research Institute. Overhauled the HR function, developed and implemented HR policies, advised on labour law, ran skills development and tracked performance through appraisals.',
      },
      {
        when: '',
        title: 'Lecturer',
        detail: 'Kenya Methodist University (Nyeri and Nairobi campuses), Mt. Kenya University and Kagumo Teachers College. Taught Education Management and Business Administration.',
      },
      {
        when: '',
        title: 'Head of Department, Kagumo Teachers College and Kerugoya Boys High School',
        detail: 'Designed and implemented learning programmes aligned with the national curriculum.',
      },
    ],
    education: [
      { when: '', title: "Master's degree, Education Administration and Planning", detail: 'University of Nairobi' },
      { when: '', title: "Bachelor's degree, Education", detail: 'Kenyatta University' },
      { when: '', title: 'Advanced certification, Human Resource Management', detail: 'Highpro Skills Training College, South Africa' },
      { when: 'Alumna', title: 'Jomo Kenyatta University of Agriculture and Technology', detail: '' },
    ],
    membership: 'Active member of the Kenya Association for Public Administration and Management (KEPAM).',
    outside: 'Outside work she is a football fan who supports community teams, and enjoys hiking, volunteering and reading.',
    stats: [
      { value: 30, suffix: '+', label: 'Years in HR, education and capacity building' },
      { value: 47, suffix: '', label: 'Counties with GBV rescue centres' },
      { value: 9, suffix: '', label: 'Points in the Women’s Charter agenda' },
      { value: 9, suffix: 'th', label: 'Among Principal Secretaries, Politrack Africa 2024' },
    ],
  },
  mandate: {
    vision:
      'A society that champions equality, safeguards rights, and provides opportunities for every Kenyan.',
    visionSource: 'State Department for Gender and Affirmative Action',
    mission:
      'To create a fair and just society where all Kenyans have equal access to opportunities and resources, advancing gender equality, protecting human rights and fostering inclusive social and economic development.',
    priorities: [
      { title: 'Gender equality', text: 'Promoting equal opportunities for women and men in employment, education, health and leadership, and working to eliminate discrimination.' },
      { title: "Women's empowerment", text: "Improving women's access to resources, training, finance and economic opportunities, including entrepreneurship and participation in decision-making." },
      { title: 'Affirmative action', text: 'Meeting the needs of marginalised communities through better access to healthcare, education and employment for vulnerable groups.' },
      { title: 'GBV prevention and response', text: 'Strengthening legal frameworks, supporting survivors and raising awareness so that communities are safe and supportive for all.' },
      { title: 'Policy advocacy and capacity building', text: 'Working with national and international partners on policy reform, public awareness and stronger service delivery at community level.' },
    ],
    initiatives: [
      { title: "Women's Charter", text: 'A nine-point agenda: economic empowerment, the two-thirds gender principle, stronger gender desks at police stations, more funding for the Anti-FGM Board, support for diaspora Kenyan women, community health work, clean domestic energy, free sanitary towels, and protection of women’s and children’s land rights.', tag: '9 points' },
      { title: 'GBV rescue centres', text: 'Rescue centres established across the counties, with operational guidelines under development.', tag: '47 counties' },
      { title: 'GBV helpline', text: 'A toll-free line that documents cases and refers survivors to help.', tag: '1195' },
      { title: 'GBV and Femicide Task Force', text: 'Developing strategies to curb the crisis of gender-based violence and femicide.', tag: 'Task force' },
      { title: 'Support for survivors', text: 'Dignity kits and safe spaces for survivors of violence.', tag: 'Dignity kits' },
    ],
    approach:
      'The Department combines research, policy development and programme implementation, working with government, non-governmental and community-based organisations to foster respect, dignity and inclusivity.',
    source: 'Source: State Department for Gender and Affirmative Action and Kenya News Agency.',
  },
  contact: {
    office: '',
    department: 'State Department for Gender and Affirmative Action',
    email: '',
    phone: '',
    helpline: '1195',
    social: [
      { label: 'Facebook', url: 'https://www.facebook.com/p/PS-Anne-Wangombe-100094145964486/' },
      { label: 'Instagram', url: 'https://www.instagram.com/psannewangombe/' },
    ],
    links: [{ label: 'State Department website', url: 'https://gender.go.ke' }],
  },
  projects: [],
  awards: [
    {
      id: 'politrack-2024',
      title: 'Ranked 9th among Principal Secretaries',
      body: 'Politrack Africa, #StarleadersAwards',
      year: '2024',
      description:
        'In a survey run from 11 to 18 March 2024 across all 47 counties by phone calls and online voting, with the impact of her department’s staff also assessed, Politrack Africa ranked PS Wang’ombe 9th among Principal Secretaries. A plaque was presented in her office.',
      photo: '',
      url: 'https://migecah.go.ke/gender-ps-anne-wangombe-named-9th-best-principal-secretary',
    },
  ],
  press: [
    {
      id: 'politrack-news',
      title: "Gender PS Anne Wang'ombe named 9th best Principal Secretary",
      outlet: 'MIGECAH',
      date: '2024-03-18',
      url: 'https://migecah.go.ke/gender-ps-anne-wangombe-named-9th-best-principal-secretary',
      image: '',
      category: 'Recognition',
      summary: 'Politrack Africa presented a plaque to the PS in her office after the #StarleadersAwards survey.',
    },
    {
      id: 'kpdc-news',
      title: 'Government to fast-track gender empowerment for women',
      outlet: 'Kenya News Agency',
      date: '',
      url: 'https://www.kenyanews.go.ke/govt-to-fast-track-gender-empowerment-for-women/',
      image: '',
      category: 'Press coverage',
      summary: 'The State Department is reviewing policies and legislation to advance gender equality and tackle gender-based violence.',
    },
  ],
  events: [
    {
      id: 'kpdc-2025',
      title: 'Kenya Population and Development Conference (KPDC) 2025',
      date: '',
      venue: 'Nairobi',
      description:
        "The PS's address, read on her behalf by Deputy Director Catherine Kayoro, called for multi-sector collaboration on population and development, noted that the Department is actively reviewing policies and legislation to advance gender equality, and urged stakeholders to turn policy aspirations into real change.",
      photo: '',
      url: 'https://www.kenyanews.go.ke/govt-to-fast-track-gender-empowerment-for-women/',
    },
  ],
  gallery: [],
}
