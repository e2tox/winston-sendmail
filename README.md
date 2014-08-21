#Winston SendMail [![Build Status](https://travis-ci.org/e2tox/winston-sendmail.png)](https://travis-ci.org/e2tox/winston-sendmail) [![Dependency Status](https://gemnasium.com/e2tox/winston-sendmail.png)](https://gemnasium.com/e2tox/winston-sendmail)

##Installation

```bash
npm install winston-sendmail
```

##Usage

```javascript
var winston = require("winston");
require("winston-sendmail");

winston.add(winston.Transports.Mail, options);
```

##Meta
```javascript
{
    error: {
        message: '',
        stack: ''
    },
    request: {
        payload: ''
    },
    response: {
        payload: ''
    }
}
```

Test build 23
