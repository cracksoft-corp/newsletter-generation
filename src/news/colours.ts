export interface NewsProviderColour {
    newsDomain: string;
    newsProvider: string;
    buttonBackgroundColour: string;
    buttonTextColour: string;
}

let black = '#000000';
let white = '#FFFFFF';

export const newsProviderColours: NewsProviderColour[] = [
    {
        newsDomain: 'bbc.co.uk',
        newsProvider: 'BBC News',
        buttonBackgroundColour: '#B80000',
        buttonTextColour: white
    },
    {
        newsDomain: 'theregister.com',
        newsProvider: 'The Register',
        buttonBackgroundColour: '#FF0100',
        buttonTextColour: white
    },
    {
        newsDomain: 'macrumors.com',
        newsProvider: 'MacRumors',
        buttonBackgroundColour: '#162944',
        buttonTextColour: white
    },
    {
        newsDomain: 'theguardian.com',
        newsProvider: 'The Guardian',
        buttonBackgroundColour: '#062962',
        buttonTextColour: '#eef915'
    },
    {
        newsDomain: 'techcrunch.com',
        newsProvider: 'Tech Crunch',
        buttonBackgroundColour: '#0B8935',
        buttonTextColour: white
    },
    {
        newsDomain: 'apple.com',
        newsProvider: 'Apple Newsroom',
        buttonBackgroundColour: '#f5f5f7',
        buttonTextColour: black
    },
    {
        newsDomain: 'wired.com',
        newsProvider: 'Wired',
        buttonBackgroundColour: black,
        buttonTextColour: white
    },
    {
        newsDomain: 'arstechnica.com',
        newsProvider: 'Ars Technica',
        buttonBackgroundColour: '#FF5917',
        buttonTextColour: white
    },
    {
        newsDomain: 'engadget.com',
        newsProvider: 'Engadget',
        buttonBackgroundColour: '#2b2d32',
        buttonTextColour: white
    },
    {
        newsDomain: 'computerweekly.com',
        newsProvider: 'Computer Weekly',
        buttonBackgroundColour: '#ee2930',
        buttonTextColour: white
    },
    {
        newsDomain: 'theverge.com',
        newsProvider: 'The Verge',
        buttonBackgroundColour: black,
        buttonTextColour: '#3BFFCF'
    },
    {
        newsDomain: 'cnet.com',
        newsProvider: 'CNET',
        buttonBackgroundColour: black,
        buttonTextColour: '#e71d1e'
    },
    {
        newsDomain: 'nytimes.com',
        newsProvider: 'The New York Times',
        buttonBackgroundColour: black,
        buttonTextColour: white
    },
    {
        newsDomain: 'reuters.com',
        newsProvider: 'Reuters',
        buttonBackgroundColour: '#FF8000',
        buttonTextColour: black
    },
    {
        newsDomain: 'independent.co.uk',
        newsProvider: 'The Independent',
        buttonBackgroundColour: '#ec1b2c',
        buttonTextColour: white
    },
    {
        newsDomain: 'telegraph.co.uk',
        newsProvider: 'The Telegraph',
        buttonBackgroundColour: '#073349',
        buttonTextColour: white
    },
    {
        newsDomain: 'cnbc.com',
        newsProvider: 'CNBC',
        buttonBackgroundColour: '#001d5a',
        buttonTextColour: white
    },
    {
        newsDomain: 'bloomberg.com',
        newsProvider: 'Bloomberg',
        buttonBackgroundColour: black,
        buttonTextColour: white
    },
    {
        newsDomain: 'techradar.com',
        newsProvider: 'TechRadar',
        buttonBackgroundColour: '#090e21',
        buttonTextColour: white
    },
    {
        newsDomain: 'mashable.com',
        newsProvider: 'Mashable',
        buttonBackgroundColour: black,
        buttonTextColour: white
    },
    {
        newsDomain: "techspot.com",
        newsProvider: "TechSpot",
        buttonBackgroundColour: "#0e5bb2",
        buttonTextColour: white
    },
    {
        newsDomain: "helpnetsecurity.com",
        newsProvider: "Help Net Security",
        buttonBackgroundColour: "#fcce00",
        buttonTextColour: white
    },
    {
        newsDomain: "wiz.io",
        newsProvider: "Wiz",
        buttonBackgroundColour: "#0754ec",
        buttonTextColour: white
    }
];
