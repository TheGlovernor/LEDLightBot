const https = require('https');
const tmi = require('tmi.js');

const clientID = oy51xyp0o4h9ndc3pgjuf0ljao79pr;
const channelName = TheGlovernor;

const firstlevelcommands = ['help', 'color']

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
    password: ''
  },
  channels: [channelName]
}

const client = new tmi.client(settings);

client.connect();

client.on('cheer', (channel, user, message) => {
  // flash the lights based on the amount of bits
});

client.on('connected', (address, port) => {
  // client.action(channelName, 'I am now connected');
});

client.on('message', (channel, user, message, self) => {
  if(self || message[0] !== '!') return;

  switch(userstate['message-type']) {
    case 'action':
    case 'chat':
      const commands = message.split(" ");
      if(commands[0] === '!led') {

        if(commands[1] === 'help') {
          client.action(channel, 'Hey guy or gal, fuck you');
        }

        if(commands[1] === 'color') {
          if(commands[2] === 'help') {
            // Say help message
          } else {
                console.log(`attempting to change to ${color}`);
            client.color(commands[2])
            .then((data) => {
              client.action(channel, `I am now ${data}`); // data returns [color]
              console.log(`changed to ${color}`);
            }).catch((err) => {
              client.action(channel, `${color} is not a valid color`);
              console.log(`${color} is not a valid color`);
            });
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

//ampenroll checkbox in medicaire table

// https://dev.twitch.tv/docs/api/webhooks-reference
// Will need to use webhooks for real time follower and subscriber data.
// This means that if I want follower or subscriber effects for my LEDs, 
// I will have to route the webhook back to my personal computer, or host this on the cloud and have the command go through wifi to the led lights.


// https://esp8266-shop.com/blog/how-to-http-get-and-post-requests-with-esp8266/
// https://www.woolseyworkshop.com/2018/12/07/controlling-an-arduino-uno-wifi-rev2-or-arduino-uno-with-wifi-shield-from-a-web-browser/
// https://blog.adafruit.com/2019/06/07/connecting-your-arduino-wifi-rev2-to-the-outside-world-adafruitio-arduino-wifi-iot-adafruitio/
// https://www.arduino.cc/en/Guide/ArduinoUnoWiFiRev2
// https://circuitdigest.com/microcontroller-projects/arduino-nodejs-tutorial-control-led-brightness-with-web-interface
// https://medium.com/@anaganisk/connecting-johnny-five-arduino-raspberry-pi-etc-over-wifi-to-the-pc-using-esp8266-a10348fdb300

// this looks like the best video so far
// https://www.youtube.com/watch?v=hP3xQtrRMmQ

// use FastLED to talk to the LED strip
// use esp8266wifi libraries to handle incoming requests from node application