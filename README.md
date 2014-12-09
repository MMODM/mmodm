##MMODM
A Massive Multiplayer Online Drum Machine powered by Twitter stream API FTW!

###Intsall & Run

make sure to edit config.js with your keys

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

```
npm install
npm start
```

### How it works

Tweet with [#MMODrumMachine](https://twitter.com/search?q=%23MMODrumMachine&src=typd) with a sequence of your notes. More details are being brewed.

###License
The MIT License (MIT)

Copyright (c) 2015 [Basheer Tome](http://basheertome.com/) && [Donald Derek Haddad](http://donaldderek.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
