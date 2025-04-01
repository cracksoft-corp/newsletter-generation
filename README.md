# Newsletter Generation

I love the newsletter.
Compiling the information and formatting it is simple, but takes a lot of care and attention to details, takes a long time, and is really boring.

This fetches the information for me, puts it in the right format for intermediary steps, and creates the email for me.

I create the first newsletter manually in ConvertKit in the format I wanted, and sent it to myself.

I exported the email to [example-newsletter.eml](./example-newsletter.eml)

I copied the html section into [example-newsletter.html.encoded](./example-newsletter.html.encoded)

I generated the cleaned html file using `cat example-newsletter.html.encoded | ./unquote.bash > example-newsletter.html`

This was handy to explore.

I made a json structure for all the required data that would change between versions of my email.
I made an input format for my data I wanted to put in, basically stripping out the aspects I wanted to code.

I got a token for searching public apple content, by going to their web browser app in a private window at music.apple.com, performing a search, and monitoring the authorisation header sent in the request.
This is a pretty pointless authentication, only seems to exist to prevent API abuse, since the token is valid for over 3 months and no credentials are require to acquire one.
Only reason I didn't keep it in this repo is incase lots of people suddenly scrape this and think these credentials are valuable and abuse them.

I created an app at [developers.spotify.com/dashboard](https://developers.spotify.com/dashboard) to get a client id and client secret.

I created an API key for YouTube Data API v3 and Google Books from my google cloud console account.

I created a LastFM developer account and got an API key.

I got an auth token from the KIT website checking the network panel, by manually uploading an image and checking the headers and storing the token. This will need to be done each time.

## Recommendations

Pretty broad, since we can recommend __anything__. Need to narrow down into broad categories.

### Music

Music is it's own category, as we want links to specific websites for apple music, spotify, youtube.

### Books

Kind of special since they're such high value to listeners/readers.

### Everything else

Is just a link to something on the internet, really. We only segregate to find the correct colour of link buttons, for example to disney+ or netflix or iPlayer, we have the correctly coloured button.

## Linky dinks

Need the url for the episode for appley wapply podcasts, and spotify
