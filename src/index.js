'use strict';
const Alexa = require('alexa-sdk');

/*
 *
 * OUR STUFF
 *
 */

class AtmoService {

  constructor() {
    this._atmos = {
      windy: "wind",
      rainy: "regen",
      sunny: "sonne"
    };
  }

  //TODO: use a weather api to get the current weather situation
  getAtmosphere() {
    return this._atmos.sunny;
  }

}

class Ssml {

  constructor(atmoService) {
    this._atmo = atmoService;
  }

  break(lengthInSeconds) {
    return "<break time='" + lengthInSeconds + "s'/>"
  }

  /**
   *
   * @param baseName (erzaehler1 (-n), uhu, spaceship1, spaceship2, ...)
   * @returns {string}
   */
  audio(baseName) {
    if (baseName === 'uhu' || baseName === 'spaceship1' || baseName === 'spaceship2' || baseName === 'outro') {
      //this audios do not support any atmo
      return "<audio src='https://dynamike.s3-eu-west-1.amazonaws.com/" + baseName + ".MP3' />"
    }
    return "<audio src='https://dynamike.s3-eu-west-1.amazonaws.com/" + baseName + "_" + this._atmo.getAtmosphere() + ".MP3' />"
  }

  /**
   * @param pitchMode (x-low, low, medium, high, x-high)
   * @returns {string}
   */
  pitchStart(pitchMode) {
    return "<prosody pitch='" + pitchMode + "'>"
  }

  pitchEnd() {
    return "</prosody>"
  }

}

class GreetingService{

  getGreeting(){
    var d = new Date(); // for now
    var hour = d.getHours();
    var returnSpeech = "Ist es nicht etwas spät? "; //00-05 //TODO:rework this message
    if(hour >= 5 && hour < 10) {
      returnSpeech = "guten Morgen ";
    } else if (hour >= 10 && hour < 17) {
      returnSpeech = "guten Mittag ";
    } else if (hour >= 17 && hour < 25) {
      returnSpeech = "Guten Abend ";
    }
    return returnSpeech;
  }

}


//=========================================================================================================================================
//TODO: The items below this comment need your attention
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this:  var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
var APP_ID = "amzn1.ask.skill.d7b8c5a5-359b-4a1b-b8b4-21402b834cc2";

//This function returns a descriptive sentence about your data.  Before a user starts a quiz, they can ask about a specific data element,
//like "Ohio."  The skill will speak the sentence from this function, pulling the data values from the appropriate record in your data.
function getSpeechDescription(item) {
  //TODO:update this for our data
  var sentence = item.StateName + " is the " + item.StatehoodOrder + "th state, admitted to the Union in " + item.StatehoodYear + ".  The capital of " + item.StateName + " is " + item.Capital + ", and the abbreviation for " + item.StateName + " is <break strength='strong'/><say-as interpret-as='spell-out'>" + item.Abbreviation + "</say-as>.  I've added " + item.StateName + " to your Alexa app.  Which other state or capital would you like to know about?";
  return sentence;
}

//This function returns the current story object
function getStoryObject(item) {
  //TODO:what to do here?
}

//We have provided two ways to create your quiz questions.  The default way is to phrase all of your questions like: "What is X of Y?"
//If this approach doesn't work for your data, take a look at the commented code in this function.  You can write a different question
//structure for each property of your data.
function getQuestion(counter, property, item) {
  //quiz:
  //return "Here is your " + counter + "th question.  What is the " + formatCasing(property) + " of "  + item.StateName + "?";

  /*
   switch(property)
   {
   case "City":
   return "Here is your " + counter + "th question.  In what city do the " + item.League + "'s "  + item.Mascot + " play?";
   break;
   case "Sport":
   return "Here is your " + counter + "th question.  What sport do the " + item.City + " " + item.Mascot + " play?";
   break;
   case "HeadCoach":
   return "Here is your " + counter + "th question.  Who is the head coach of the " + item.City + " " + item.Mascot + "?";
   break;
   default:
   return "Here is your " + counter + "th question.  What is the " + formatCasing(property) + " of the "  + item.Mascot + "?";
   break;
   }
   */
}

//This is the function that returns an answer to your user during the quiz.  Much like the "getQuestion" function above, you can use a
//switch() statement to create different responses for each property in your data.  For example, when this quiz has an answer that includes
//a state abbreviation, we add some SSML to make sure that Alexa spells that abbreviation out (instead of trying to pronounce it.)
function getAnswer(property, item) {
  switch (property) {
    case "Abbreviation":
      return "The " + formatCasing(property) + " of " + item.StateName + " is <say-as interpret-as='spell-out'>" + item[property] + "</say-as>. "
      break;
    default:
      return "The " + formatCasing(property) + " of " + item.StateName + " is " + item[property] + ". "
      break;
  }
}

//This is the welcome message for when a user starts the skill without a specific intent.
var WELCOME_MESSAGE = "Dies ist die erste Version von Dynamike. Um das Spiel zu starten sage start"; //TODO:change + use SSML

//This is the message a user will hear when they start a quiz.
var START_QUIZ_MESSAGE = "Gut, dann fangen wir an.";

//This is the message a user will hear when they try to cancel or stop the skill, or when they finish a quiz.
var EXIT_SKILL_MESSAGE = "Danke für's Spielen."; //TODO:test "für's"

//This is the message a user will hear after they ask (and hear) about a specific data element.
var REPROMPT_SPEECH = "Which other state or capital would you like to know about?"; //TODO:we do not need that

//This is the message a user will hear when they ask Alexa for help in your skill.
var HELP_MESSAGE = ""; //TODO:add some possible instructions here


//This is the response a user will receive when they ask about something we weren't expecting.  For example, say "pizza" to your
//skill when it starts.  This is the response you will receive.
function getBadAnswer(item) {
  return "I'm sorry. " + item + " is not something I know very much about in this skill. " + HELP_MESSAGE;
}

//This is the message a user will receive after each question of a quiz.  It reminds them of their current score.
function getCurrentScore(score, counter) {
  return "Your current score is " + score + " out of " + counter + ". ";
}
//TODO:we do not need that

//This is the message a user will receive after they complete a quiz.  It tells them their final score.
function getFinalScore(score, counter) {
  return "Your final score is " + score + " out of " + counter + ". ";
}
//TODO:change that for our purpose

//These next four values are for the Alexa cards that are created when a user asks about one of the data elements.
//This only happens outside of a quiz.

//If you don't want to use cards in your skill, set the USE_CARDS_FLAG to false.  If you set it to true, you will need an image for each
//item in your data.
var USE_CARDS_FLAG = false; //TODO:we might use this

//This is what your card title will be.  For our example, we use the name of the state the user requested.
function getCardTitle(item) {
  return item.StateName;
}

//This is the small version of the card image.  We use our data as the naming convention for our images so that we can dynamically
//generate the URL to the image.  The small image should be 720x400 in dimension.
function getSmallImage(item) {
  return "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/720x400/" + item.Abbreviation + "._TTH_.png";
}

//This is the large version of the card image.  It should be 1200x800 pixels in dimension.
function getLargeImage(item) {
  return "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/1200x800/" + item.Abbreviation + "._TTH_.png";
}

//=========================================================================================================================================
//Replace this data with your own.
//=========================================================================================================================================
var data = [
  {Name: "Martin"}
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

var counter = 0;

var states = {
  START: "_START",
  QUIZ: "_QUIZ"
};

const s = new Ssml(new AtmoService());
const gs = new GreetingService();

const handlers = {
  //here we land first and add the current state to our session
  "LaunchRequest": function () {
    this.handler.state = states.START;
    this.emitWithState("Start");
  },
  "QuizIntent": function () {
    this.handler.state = states.QUIZ;
    this.emitWithState("Quiz");
  },
  "AnswerIntent": function () {
    this.handler.state = states.START;
    this.emitWithState("AnswerIntent");
  },
  "AMAZON.HelpIntent": function () {
    this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
  },
  "Unhandled": function () {
    this.handler.state = states.START;
    this.emitWithState("Start");
  }
};

var startHandlers = Alexa.CreateStateHandler(states.START, {
  "Start": function () {
    //this.emit(":ask", WELCOME_MESSAGE, HELP_MESSAGE);
    this.emit(":ask",
      s.audio("erzaehler1") + s.break(1) + "Hallo. Ich bin Mike! Und wie ist dein Vorname?");
    counter = 0;

    //this.emit(":ask", <speak><audio src="www.youtube.com/watch?v=To1jLeGPqXg" /></speak> + "" + "Oh, wer bist du denn? Ich bin Mike! Und wie heißt du?", HELP_MESSAGE);
    //<audio src="https://carfu.com/audio/carfu-welcome.mp3" />
    //TODO:play introduction here -- we don't use a "meta wrapper", when the app starts, the game starts directly
  },
  "AnswerIntent": function () {
    //TODO:get the current slots
    //var item = getItem(this.event.request.intent.slots);
    console.log(this.event.request.intent.slots); //returns log for debuggung on lambda

    //not sure what this does, i assume it will read out the data (see above the big table) in case there is something written there?
    //TODO:basically, we can just delete this out, since this is not really what we want to do (though it might come in handy)

    /*if (item && item[Object.getOwnPropertyNames(data[0])[0]] != undefined)
     {
     console.log("\nMEMO's TEST\n");
     if (USE_CARDS_FLAG)
     {
     var imageObj = {smallImageUrl: getSmallImage(item), largeImageUrl: getLargeImage(item)};
     this.emit(":askWithCard", getSpeechDescription(item), REPROMPT_SPEECH, getCardTitle(item), getTextDescription(item), imageObj);
     }
     else
     {
     //TODO:not hardcode?
     this.emit(":ask", "Hallo Martin"//getSpeechDescription(item)
     , REPROMPT_SPEECH);

     }
     }
     else
     {
     this.emit(":ask", getBadAnswer(item), getBadAnswer(item));

     }*/
    switch (counter) {
      //just check for the counter and depending on that do something (phases)
      case 0:
        this.attributes["Benutzername"] = this.event.request.intent.slots.BenutzerName.value;
        this.emit(":ask",
        //TODO: speak username as a name
          s.break(1) + gs.getGreeting() + s.break(0.2) + this.attributes["Benutzername"] +s.break(0.5) + "Ich bin auf der Suche nach meinem Raumschiff. Bitte hilf mir dabei." +
          s.break(1) + s.audio("erzaehler2") +
          s.break(1) + s.audio("uhu") +
          s.pitchStart("high") + " Hey, " + s.pitchEnd() + "ich höre einen Vogel! " +
          s.audio("uhu") +
          s.audio("uhu") +
          " Kannst du erkennen, was es für eine Vogelart ist? ");
        break;
      case 1:
        this.emit(":ask",
          s.pitchStart("high") + "Falsch. " + s.pitchEnd() +
          s.break(1) + " versuch es nochmal!");
        break;
      case 2:
        this.emit(":ask",
          s.pitchStart("high") + "Super" + s.pitchEnd() + this.attributes["Benutzername"] + ", das war richtig." + s.break(1) +
          "Der Uhu ist die größte Art von Eulen. Er frisst gerne Mäuse und sogar andere Vögel. " +
          "Darum werden Uhu's von bestimmten Voegeln geärgert! Wenn sie einen Uhu tagsüber entdecken, fangen sie laut an zu schreien. " +
          s.audio("erzaehler3") +
          s.pitchStart("high") + "Oh," + s.pitchEnd() + "diese Stelle kenne ich!" + s.break(1) +
          "Hier habe ich mit meinem Raumschiff einen Baum gestreift! Dort sieht man noch die Kratzspuren in der Baumrinde." + s.break(1) + " Es gibt zwei Möglichkeiten: Wir können nun Richtung See oder zur Lichtung. Wo sollen wir hin?");
        break;
      case 3:
        this.emit(":ask",
          //TODO:add steps audio?
          s.audio("erzaehler4") +
          "Hier ist es! Hier habe ich mein Raumschiff geparkt!" +
          s.pitchStart("high") + "Ju hu" + s.pitchEnd() + //how to pronounce "juhu"?
          "Endlich habe ich es mit deiner Hilfe gefunden!" +
          //cobblesnitch
          s.audio("erzaehler5") +
          "Er will eine Frage beantwortet haben, sonst lässt er uns nicht zum Raumschiff." +
          s.break(0.5) + "Oh je. Das müssen wir zusammen machen!" +
          s.audio("cobblesnitch2") +

          "Hier kommt die erste Frage. " + s.break(1) +
          "Was frisst ein Uhu gerne?" +
          "Äpfel" + s.break(0.3) +
          "Mäuse" + s.break(0.1) +
          "Oder Hundekuchen." + s.break(0.5));
        break;
      case 4:
        //check answer
        this.emit(":tell",
          "gut gemacht" + this.attributes["Benutzername"] +
          s.audio("erzaehler6") +
          "Danke" + this.attributes["Benutzername"] + ", dass du mir geholfen hast!" + s.break(1) +
          s.audio("erzaehler7") +
          s.audio("outro"));
        break;
      default:
        this.emit(":tell",
          "etwas ist schiefgelaufen. Bitte melde dich bei dem Entwickler. Danke für das Ausprobieren");
    }
    counter++;
  },
  "QuizIntent": function () {
    this.handler.state = states.QUIZ;
    this.emitWithState("Quiz");
  },
  "AMAZON.StopIntent": function () {
    this.emit(":tell", EXIT_SKILL_MESSAGE);
  },
  "AMAZON.CancelIntent": function () {
    this.emit(":tell", EXIT_SKILL_MESSAGE);
  },
  "AMAZON.HelpIntent": function () {
    this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
  },
  "Unhandled": function () {
    this.emitWithState("Start");
  }
});


var quizHandlers = Alexa.CreateStateHandler(states.QUIZ, {
  "Quiz": function () {
    this.attributes["response"] = "";
    this.attributes["counter"] = 0;
    this.attributes["quizscore"] = 0;//TODO:we dont need this?
    this.emitWithState("AskQuestion");

    //TODO: test if this gets called only 1 time, for security the wrapper was used here
    if (this.attributes["counter"] == 0) {
      this.attributes["response"] = START_QUIZ_MESSAGE + " "; //TODO:play introduction audio instead of START_QUIZ_MESSAGE
    }
  },
  "AskQuestion": function () {


    //TODO:ask for name of user
    this.attributes["username"] =

      this.attributes["quizitem"] = item;
    this.attributes["quizproperty"] = property;
    this.attributes["counter"]++;

    var question = getQuestion(this.attributes["counter"], property, item);
    var speech = this.attributes["response"] + question;

    this.emit(":ask", speech, question);
  },
  "AnswerIntent": function () {
    var response = "";
    var item = this.attributes["quizitem"];
    var property = this.attributes["quizproperty"]

    var correct = compareSlots(this.event.request.intent.slots, item[property]);

    if (correct) {
      response = getSpeechCon(true);
      this.attributes["quizscore"]++;
    }
    else {
      response = getSpeechCon(false);
    }

    response += getAnswer(property, item);

    if (this.attributes["counter"] < 10) {
      response += getCurrentScore(this.attributes["quizscore"], this.attributes["counter"]);
      this.attributes["response"] = response;
      this.emitWithState("AskQuestion");
    }
    else {
      response += getFinalScore(this.attributes["quizscore"], this.attributes["counter"]);
      this.emit(":tell", response + " " + EXIT_SKILL_MESSAGE);
    }
  },
  "AMAZON.StartOverIntent": function () {
    this.emitWithState("Quiz");
  },
  "AMAZON.StopIntent": function () {
    this.emit(":tell", EXIT_SKILL_MESSAGE);
  },
  "AMAZON.CancelIntent": function () {
    this.emit(":tell", EXIT_SKILL_MESSAGE);
  },
  "AMAZON.HelpIntent": function () {
    this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
  },
  "Unhandled": function () {
    this.emitWithState("AnswerIntent");
  }
});

function compareSlots(slots, value) {
  for (var slot in slots) {
    if (slots[slot].value != undefined) {
      if (slots[slot].value.toString().toLowerCase() == value.toString().toLowerCase()) {
        return true;
      }
    }
  }
  return false;
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomSymbolSpeech(symbol) {
  return "<say-as interpret-as='spell-out'>" + symbol + "</say-as>";
}

function getItem(slots) {
  var propertyArray = Object.getOwnPropertyNames(data[0]);
  var value;

  for (var slot in slots) {
    if (slots[slot].value !== undefined) {
      value = slots[slot].value;
      for (var property in propertyArray) {
        var item = data.filter(x => x[propertyArray[property]].toString().toLowerCase() === slots[slot].value.toString().toLowerCase());
        if (item.length > 0) {
          return item[0];
        }
      }
    }
  }
  return value;
}

function getSpeechCon(type) {
  var speechCon = "";
  if (type) return "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length - 1)] + "! </say-as><break strength='strong'/>";
  else return "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length - 1)] + " </say-as><break strength='strong'/>";
}

function formatCasing(key) {
  key = key.split(/(?=[A-Z])/).join(" ");
  return key;
}

function getTextDescription(item) {
  var text = "";

  for (var key in item) {
    text += formatCasing(key) + ": " + item[key] + "\n";
  }
  return text;
}

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  alexa.registerHandlers(handlers, startHandlers, quizHandlers);
  alexa.execute();
};
