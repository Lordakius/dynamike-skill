# dynamike-skill

## build

1. `cd src` 
2. `npm install`
3. `zip -r ../dynamike-skill.zip .`

## deploy

upload zip to your lambda

## trouble shooting MP3

1. check correct configuration: 16kHz sample rate, 48 kb/s bit rate, max length 90s
2. if mismatch: convert manually via ```docker run -v `pwd`:`pwd` -w `pwd` jrottenberg/ffmpeg -i erzaehlertext1.mp3 -ar 16k -b:a 48k erzaehlertext1-fixed.mp3``` or use the prepared script `resources/orig2fixed.sh`
3. upload on bucket and make verify public availability

## references

* quiz demo sample from https://github.com/alexa/skill-sample-nodejs-quiz-game
* ssml docu https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference
* alexa skill config via https://developer.amazon.com
* aws lambda config via https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions
