# MMODM
![buid](https://travis-ci.org/MMODM/mmodm.svg?branch=master)

A Massive Multiplayer Online Drum Machine powered by the Twitter stream API!

## Install & Run

* Edit config.js with your keys.
* Install and run [Redis](http://redis.io/).

```
{
    consumer_key: 'twitter_consumer_key',
    consumer_secret: 'twitter_consumer_secret',
    ac_key:'twitter_access_token_key',
    ac_secret:'twitter_access_token_secret',
    cb_url:'twitter_callback_url',
    db:'mongodb://localhost/dbname',
    session_secret:'session_secret'
}
```

Then run the installer.

```
npm install
```

Then start the servers

```
redis-server
mongod
npm start
```

### Sample Run
<img src='https://raw.githubusercontent.com/MMODM/mmodm/master/public/images/previeww.png' width='400'/>

## How it works

Tweet with [#MMODM](http://twitter.com/search?q=%23MMODM) with a sequence of your notes. Feel free to reply to [@playmmodm](http://twitter.com/playmmodm) to play without over-spamming your feed.

To define a sequence, use square brackets [] and then a string of 16 letters a-z that each correspond to a different instrument. There are 16 beats in a loop. Use a '-' to rest. For example:

```
riff on this [a--a--a--abc--cc] with me on #mmodm http://mmodm.co/
```

### License
<!-- 
Copyright (c) 2015 [Basheer Tome](http://basheertome.com/) & [Donald Derek Haddad](http://donaldderek.com/) -->

The MIT License (MIT)

> <sup>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</sup>
>
> <sup>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</sup>
>
> <sup>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</sup>
