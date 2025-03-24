export interface MediaProviderColour {
    mediaDomain: string;
    mediaProvider: string;
    buttonBackgroundColour: string;
    buttonTextColour: string;
}

let black = '#000000';
let white = '#FFFFFF';

export const mediaProviderColours: MediaProviderColour[] = [
    {
        mediaDomain: 'bbc.co.uk',
        mediaProvider: 'BBC iPlayer',
        buttonBackgroundColour: black,
        buttonTextColour: '#ff4c85'
    },
    {
        mediaDomain: 'itv.com',
        mediaProvider: 'ITV X',
        buttonBackgroundColour: '#073744',
        buttonTextColour: '#e9f75c'
    },
    {
        mediaDomain: 'channel4.com',
        mediaProvider: 'Channel 4',
        buttonBackgroundColour: '#aaff89',
        buttonTextColour: black
    },
    {
        mediaDomain: 'netflix.com',
        mediaProvider: 'Netflix',
        buttonBackgroundColour: '#e50a14',
        buttonTextColour: black
    },
    {
        mediaDomain: 'amazon.co.uk',
        mediaProvider: 'Amazon Prime Video',
        buttonBackgroundColour: black,
        buttonTextColour: '#0578ff'
    },
    {
        mediaDomain: 'amazon.com',
        mediaProvider: 'Amazon Prime Video',
        buttonBackgroundColour: black,
        buttonTextColour: '#0578ff'
    },
    {
        mediaDomain: 'disneyplus.com',
        mediaProvider: 'Disney+',
        buttonBackgroundColour: '#0d6072',
        buttonTextColour: white
    },
    {
        mediaDomain: 'apple.com',
        mediaProvider: 'Apple TV+',
        buttonBackgroundColour: black,
        buttonTextColour: white
    },
    {
        mediaDomain: 'imdb.com',
        mediaProvider: 'IMDb',
        buttonBackgroundColour: '#f6c51a',
        buttonTextColour: black
    },
    {
        mediaDomain: 'youtube.com',
        mediaProvider: 'YouTube',
        buttonBackgroundColour: '#ff0033',
        buttonTextColour: white
    }
];
