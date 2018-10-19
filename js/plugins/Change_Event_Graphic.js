/*=============================================================================
 * Change Event Graphic
 * By CT_Bolt
 * Change_Event_Graphic.js
 * Version: 1.50
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Allows the graphic/direction of events, players, followers, & actors to be changed via script calls.
 * @author CT_Bolt
 *
 * @help
 *
 * Change Event Graphic
 * Version 1.50
 * CT_Bolt
 *
 * Description:
 * Allows the graphic/direction of events, players, followers, & actors to be changed via script calls.
 *
 * How to Use:
 * The following are used in a script (or script call from the event command)
 *
 *   changeEventGraphic(eventId, charFilename, charIndex, direction)
 *   Example:
 *     changeEventGraphic(5, "Actor1", -1, 2);
 *     This changes Event ID #5 to filename "Actor1", picks a random index from the character sheet & set the direction to down.
 *
 *     changeEventGraphic(-1, "Actor1", -1);
 *     This changes the Actor Id #1 to filename "Actor1" & picks a random index from the character sheet, direction is ommited.
 *     Note: Use a negitive number to use Actor ID's from the database instead of events.
 *     Note: Due to this being the actor NOT the follower direction doesn't seem affected by this & thus was ommited.
 *
 *     changeEventGraphic(2, "Actor1", 3);
 *     This changes Event ID #2 to filename "Actor1" & sets the character index to 3 (4th from the left, 0 is the first index)
 *
 *     changeEventGraphic("player", "Monster", -1, -1);
 *     This changes the players graphic to filename "Monster", picks a random index from the character sheet & pick a random direction
 *
 *
 *   changePlayerGraphic(charFilename, charIndex, direction)
 *   Example:
 *     changePlayerGraphic("Monster", -1, -1);
 *     This changes the player graphic to filename "Monster", picks a random index & a random direction
 *
 *     changePlayerGraphic("Monster", -1);
 *     This changes the player graphic to filename "Monster", picks a random index & does not change direction
 *
 *   changePlayerDirection(direction)
 *   Example:
 *     changePlayerDirection(4);
 *     This changes the player direction to left.
 *
 *   changePlayerDirection(-1);
 *   This changes the player direction to a random direction.
 *
 *   changeFollowerDirection(followerIndex, direction)
 *   Example:
 *     changeFollowerDirection(0, -1);  // This picks a random direction for the first follower (index starts at 0)
 *     changeFollowerDirection(2, 6);   // This sets the direction of follower #3 to up
 *
 *   batchChangeFollowerGraphic(start_index, end_index, charFilename, charIndex, direction)
 *   Example:
 *     batchChangeFollowerGraphic(0, 3, "Monster", -1, -1);
 *
 *   batchChangeFollowerDirection(start_index, end_index, direction)
 *   Example:
 *     batchChangeFollowerDirection(2, 3, -1);
 *
 *   batchChangeEventGraphic(eventId_start, eventId_end, charFilename, charIndex, direction)
 *   Example:
 *     batchChangeEventGraphic(1, 5, "Evil", 2, 2);
 *
 *   arrayChangeEventGraphic(eventId_array, charFilename, charIndex, direction)
 *   Example:
 *     arrayChangeEventGraphic([5, 8, 7, 4, 10], "Actor2", -1);
 *
 *   arrayChangeFollowerGraphic(followerIndex_array, charFilename, charIndex, direction)
 *   Example:
 *     arrayChangeFollowerGraphic([0, 3, 1], "Actor3", 4, -1);
 *
 *   arrayChangeFollowerDirection(followerIndex_array, direction)
 *   Example:
 *     arrayChangeFollowerDirection([2, 4], 2);
 *
 *   randomPickChangeEventGraphic(eventId_array, charFilename, charIndex, direction)
 *   Example:
 *     randomPickChangeEventGraphic([61, 5, 9, 29, 42], "Monster", -1, -1);
 *
 *   randomPickChangeFollowerGraphic(followerIndex_array, charFilename, charIndex, direction)
 *   Example:
 *     randomPickChangeFollowerGraphic([0, 1, 5, 4], "Monster", -1, -1);
 *
 * History Log:
 *    v1.00 Initial Release
 *    v1.10 *New Feature*
 *           Change Player Graphic
 *    v1.50 *Major re-write
 *          *New Features*
 *              * Change Player Character Graphic/Direction ( -1 = Random)
 *              * Change Actor Character Graphic ( -1 = Random)
 *              * Change Followers Character Graphic/Direction ( -1 = Random)
 *              * Batch Change Followers Character Graphic/Direction ( -1 = Random)
 *              * Batch Change Event/Actor Character Graphic ( -1 = Random)
 *              * Array Change Followers Character Graphic/Direction ( -1 = Random)
 *              * Array Change Event/Actor Character Graphic ( -1 = Random)
 */

var CTB = CTB || {};
CTB.Change_Event_Graphic  = CTB.Change_Event_Graphic || {};

var Imported = Imported || {};
Imported["CT_Bolt Change Event Graphic"] = 1.50;

function changeEventGraphic(eventId, charFilename, charIndex, direction){
    if (eventId == "player"){
      var event_Id = 0;
    }else{
      var event_Id = eventId || null;
    }

    var characterIndex = charIndex || 0;
    var character_filename = charFilename;
    var direction = direction || null;

  if (event_Id || eventId == "player"){
    if (direction === -1){direction = (Math.floor(Math.random() * (4 )) + 1)*2;}
    if (charIndex === -1){
      if (eventId === "player"){
        var characterIndex = $gamePlayer._characterIndex;
      }else{
        if (event_Id < 0){
            var actorId = Math.abs(event_Id);
            var characterIndex = $gameActors.actor(actorId)._characterIndex;
        }else{
          if ($gameMap.event(eventId)){
          var characterIndex = $gameMap._events[event_Id]._characterIndex;
          }
        }
      }
      var r = Math.floor(Math.random() * (7 - 0)) + 0;
      while (r === characterIndex){var r = Math.floor(Math.random() * (7 - 0)) + 0;}
    }else{
      r = charIndex;
    }

    if (eventId === "player"){
      $gamePlayer.setImage(character_filename, r);
      if (direction){$gamePlayer.setDirection(direction);} // 2 = Down, 4 = Left, 6 = Right, 8 = Up
    }else{
      if (event_Id < 0){
        var actorId = Math.abs(event_Id);
        $gameActors.actor(actorId).setCharacterImage(character_filename, r);
        if (direction){$gameActors.actor(actorId)._direction = direction};
        $gamePlayer._followers.refresh();;
      }else{
        if ($gameMap.event(event_Id)){
          $gameMap.event(event_Id).setImage(character_filename, r);
          if (direction){$gameMap.event(event_Id).setDirection(direction);} // 2 = Down, 4 = Left, 6 = Right, 8 = Up
        }else{
          console.log("Invalid Event!" + "Attempted Event ID #" + event_Id);
        }
      }
    }
  }else{
   console.log("Not a valid Event ID Parameter");
  }
}

function changePlayerGraphic(charFilename, charIndex, direction){
  changeEventGraphic("player", charFilename, charIndex, direction);
}

function changeFollowerGraphic(followerIndex, charFilename, charIndex, direction){
  var followerIndex = followerIndex || 0;
  var characterIndex = charIndex || 0;
  var character_filename = charFilename;
  var direction = direction || null;

  if ($gamePlayer._followers._data[followerIndex]){
    if (direction === -1){direction = (Math.floor(Math.random() * (4 )) + 1)*2;}
    if (charIndex === -1){
      var characterIndex = $gamePlayer._followers._data[followerIndex]._characterIndex;
      var r = Math.floor(Math.random() * (7 - 0)) + 0;
      while (r === characterIndex){var r = Math.floor(Math.random() * (7 - 0)) + 0;}
    }else{
      r = charIndex;
    }

    $gamePlayer._followers._data[followerIndex].setImage(character_filename, r);
    if (direction){$gamePlayer._followers._data[followerIndex].setDirection(direction);} // 2 = Down, 4 = Left, 6 = Right, 8 = Up

    console.log($gamePlayer._followers._data[followerIndex]);
  }
}

function changePlayerDirection(direction){
  if (direction === -1){direction = (Math.floor(Math.random() * (4 )) + 1)*2;}
  $gamePlayer.setDirection(direction);
};

function changeFollowerDirection(followerIndex, direction){
  if (direction === -1){direction = (Math.floor(Math.random() * (4 )) + 1)*2;}
  $gamePlayer._followers._data[followerIndex].setDirection(direction);
};

function batchChangeFollowerGraphic(start_index, end_index, charFilename, charIndex, direction){
  var charIndex = charIndex || 0;
  for (var followerIndex = start_index; followerIndex < end_index; followerIndex++){
      changeFollowerGraphic(followerIndex, charFilename, charIndex, direction);
  }
}

function batchChangeFollowerDirection(start_index, end_index, direction){
  var charIndex = charIndex || 0;
  for (var followerIndex = start_index; followerIndex < end_index; followerIndex++){
    changeFollowerDirection(followerIndex, direction)
  }
}

function batchChangeEventGraphic(eventId_start, eventId_end, charFilename, charIndex, direction){
  var charIndex = charIndex || 0;
  for (var eventId = eventId_start; eventId < eventId_end; eventId++){
      changeEventGraphic(eventId, charFilename, charIndex, direction);
  }
}

function arrayChangeEventGraphic(eventId_array, charFilename, charIndex, direction){
  var charIndex = charIndex || 0;
  for (var i = 0; i < eventId_array.length; i++){
      changeEventGraphic(eventId_array[i], charFilename, charIndex, direction);
  }
}

function randomPickChangeEventGraphic(eventId_array, charFilename, charIndex, direction){
  var charIndex = charIndex || 0;
  var r = Math.floor(Math.random() * (eventId_array.length + 0)) + 0;
  changeEventGraphic(eventId_array[r], charFilename, charIndex, direction);
}

function randomPickChangeFollowerGraphic(followerIndex_array, charFilename, charIndex, direction){
  var charIndex = charIndex || 0;
  var r = Math.floor(Math.random() * (followerIndex_array.length + 0)) + 0;
  changeFollowerGraphic(followerIndex_array[r], charFilename, charIndex, direction);
}

function arrayChangeFollowerGraphic(followerIndex_array, charFilename, charIndex, direction){
  var charIndex = charIndex || 0;
  for (var i = 0; i < followerIndex_array.length; i++){
      changeFollowerGraphic(followerIndex_array[i], charFilename, charIndex, direction);
  }
}

function arrayChangeFollowerDirection(followerIndex_array, direction){
  var charIndex = charIndex || 0;
  for (var i = 0; i < followerIndex_array.length; i++){
    changeFollowerDirection(followerIndex_array[i], direction);
  }
}