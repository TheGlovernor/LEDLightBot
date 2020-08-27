const axios = require('axios');
const tmi = require('tmi.js');
const fs = require('fs');

const secrets = JSON.parse(fs.readFileSync('secrets.json'));
const clientID = 'oy51xyp0o4h9ndc3pgjuf0ljao79pr';
const channelName = 'TheGlovernor';
const lightIP = 'http://192.168.0.17/'

const maxFlashPerPerson = 10;
const flashTimeOut = 6000;
const animChangeTimeOut = 30000;
const colorChangeTimeOut = 12000;

userData = {
  'theglovernor': 12000,
};

// valid colors for twitch without turbo
colorList= ['Blue', 'BlueViolet', 'CadetBlue', 'Chocolate', 'Coral', 'DodgerBlue', 'Firebrick', 'GoldenRod', 'Green', 'HotPink', 'OrangeRed', 'Red', 'SeaGreen', 'SpringGreen', 'YellowGreen'];

// command to get the bots attention
const att = '!led'

// help commands
const helpCmds = {
  HELP: 'help',
  FLASH: 'flash',
  COLOR: 'color',
  ANIM: 'animation'
}

// first level commands
const topCmds = {
  HELP: 'help',
  FLASH: 'flash',
  COLOR: 'color',
  ANIM: 'animation'
}

// color commands
const colorCmds = {
  HELP: 'help',
  PRIMARY: 'primary',
  SECONDARY: 'secondary'
}

// animation commands
const animCmds= {
  HELP: 'help',
  RAIN: 'rainbow',
  FADE: 'fade',
  CHASE: 'chase',
  WIPE: 'wipe',
  SCAN: 'scanner'
}

// settings for tmi
const settings = {
  options: {
    debug: true
  },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: 'LEDLightBot',
    password: secrets.password
  },
  channels: [channelName]
}

const client = new tmi.client(settings);

client.connect();

// -------------- event funcitons ------------------

client.on('cheer', (channel, user, message) => {
  // flash the lights based on the amount of bits
});

client.on('connected', (address, port) => {
  // client.action(channelName, 'I am now connected');
});

client.on('message', (channel, user, message, self) => {
  if(self || message[0] !== '!') return;

  switch(user['message-type']) {
    case 'action':
    case 'chat':
      const commands = message.split(" ");
      if(commands[0] === att) {

        if(commands[1] === topCmds.HELP) {
          sendHelp(channel, helpCmds.HELP);
        }

        if(commands[1] === topCmds.FLASH) {
          // check if person can flash
          if(checkFlashes(user.username) > 0) {
            flash(commands[2]);
            decreaseFlashes(user.username, 1);
          } else {
            // do something if they cant flash
          }
        }

        if(commands[1] === topCmds.COLOR) {
          if(commands[2] === colorCmds.HELP) {
            SendHelp(channel, helpCmds.COLOR);
          } else if(commands[2] === colorCmds.PRIMARY || commands[2] === colorCmds.SECONDARY) {
            let color = commands[3];
            let level = 1;
            if(commands[2] === colorCmds.SECONDARY) {
              level = 2;
            }
            let r = convertHex(color.substring(1,3));
            let g = convertHex(color.substring(3,5));
            let b = convertHex(color.substring(5,7));
            setColor(level,r,g,b);
          }
        }

        if(commands[1] === topCmds.ANIM) {
          if(commands[2] === helpCmds.ANIM) {
            sendHelp(channel, helpCmds.ANIM)
          } else if (commands[2] === animCmds.RAIN || commands[2] === animCmds.FADE || commands[2] === animCmds.SCAN || commands[2] === animCmds.CHASE || commands[2] === animCmds.WIPE) {
            setAnim(commands[2], 10);
          }
        }

      }
      break;
    case 'whisper':
      break;
  }
});

client.on('resub', (channel, username, months, message, user, methods) => {
  // Flash lights based on months
});

client.on('subscription', (channel, username, method, message, userstate) => {
  // Flash lights for first subscription
});

client.on('subgift', (channel, username, streakMonths, recipient, methods, userstate) => {
  // Flash lights for # of gifted subs
  // let senderCount = ~~userstate["msg-param-sender-count"];
});

client.on('submysterygift', (channel, username, numbOfSubs, methods, userstate) => {
  // Flash lights for # of gifted subs
});

// -------------------- http functions -----------------------

const flash = function(amount) {
  console.log('sending flash!');
  axios.post(lightIP, {
    type: "flash",
    amount: amount
  })
  .then(res => {
    console.log(`response from LED controller: ${res}`)
  })
  .catch(err => {
    console.log(`error from LED controller: ${err}`)
  })
}

const setColor = function(level, r, g, b) {
  console.log('setting color!');
  axios
    .post(lightIP, {
      type: "color",
      level: level,
      redValue: r,
      greenValue: g,
      blueValue: b,
    })
    .then(res => {
      console.log(`response from LED controller: ${res}`)
    })
    .catch(err => {
      console.log(`error from LED controller: ${err}`)
    })
}

const setAnim = function(anim, speed) {
  console.log('setting animation');
  axios
    .post(lightIP, {
      type: "animation",
      anim: anim,
      speed: speed
    })
}

// ------------------- utility functions ----------------------

// send help message to the chat
const sendHelp= function(channel, msg) {
  if(msg === helpCmds.HELP) {
    // top level help message
    client.action(channel, `Hey guy or gal, fuck you. I haven't written this help message yet`);
  } else if(msg === helpCmds.FLASH) {
    // flash help message
    client.action(channel, `Use '!led flash [number 1 through 10]' to flash me. You can only flash me up to ten times and flashes refresh at 1 per minute`);
  } else if(msg === helpCmds.COLOR) {
    // color help message
    client.action(channel, `Use '!led color [primary|secondary] [color]' to change the LED's primary or secondary colors. [color] must be in hex format '#ffffff'`);
  } else if(msg === helpCmds.ANIM) {
    client.action(channel, `Use '!led animation [rainbow]' to change the animation`);
  }
}

const checkFlashes = function(user) {
  if(!userData.hasOwnProperty(user)) {
    userData[user] = 10;
  }
  return userData[user];
}

const increaseFlashes = function() {
  Object.entries(userData).forEach(([key, value]) => {
    if(value < maxFlashPerPerson) {
      userData[key] = value +1;
    }
    // console.log(`${key} ${value}`);
  });
}

setInterval(increaseFlashes, flashTimeOut);

const decreaseFlashes = function(user, n) {
  if(userData[user] > 0) {
    userData[user] = userData[user] - n;
  } else {
    userData[user] = userData[user] - n;
    console.log(`!!!!!!!!!!!! User ${user} was able to flash when they shouldn't have`);
  }
}

// convert hex to decimal
const convertHex = function(hexString) {
  val = parseInt(hexString, 16);
  console.log(`value: ${val}`)
  return val;
}

// make sure the input is an int
const getInt = function(string) {
  const parsed = parseInt(string, 10);
  if (isNaN(parsed)) { return 0; }
  return parsed;
}

// https://dev.twitch.tv/docs/api/webhooks-reference
// Will need to use webhooks for real time follower and subscriber data.
// This means that if I want follower or subscriber effects for my LEDs,
// I will have to route the webhook back to my personal computer, or host this on the cloud and have the command go through wifi to the led lights.


                        // console.log(`attempting to change to ${color}`);
                        // client.color(commands[2])
                        // .then((data) => {
                        //   client.action(channel, `I am now ${data}`); // data returns [color]
                        //   console.log(`changed to ${color}`);
                        // }).catch((err) => {
                        //   client.action(channel, `${color} is not a valid color`);
                        //   console.log(`${color} is not a valid color`);
                        // });
