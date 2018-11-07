//-----------------------------------------------------------------------------
//  Galv's Stationary Turn
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_StationaryTurn.js
//-----------------------------------------------------------------------------
//  2017-03-07 - Version 1.3 - + compatibility with Hime lock facing direction
//  2016-07-28 - Version 1.2 - fixed some vehicle embarking bugs
//  2016-07-24 - Version 1.1 - fixed a bug when move route forcing while dir
//                             fix was on did not move the player
//  2016-06-30 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_StationaryTurn = true;

var Galv = Galv || {};            // Galv's main object
Galv.STURN = Galv.STURN || {};    // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.3) Change movement so the player turns on the spot if direction is tapped.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Delay
 * @desc Delay in frames before movement happens after turning
 * @default 5
 *
 * @help
 *   Galv's Stationary Turn
 * ----------------------------------------------------------------------------
 * This plugin changes movement so that when the player taps a direction that
 * he/she is not already facing then they will turn on the spot instead of
 * moving. If moving, dashing or already facing the direction of movement,
 * there will be no delay and walking will happen as normal.
 *
 * This plugin does not take into account mouse movement.
 */

//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------


(function() {

Galv.STURN.delay = Number(PluginManager.parameters('Galv_StationaryTurn')['Delay']);

Galv.STURN.Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function() {
	this._turnPause = 0;
	Galv.STURN.Game_Player_initMembers.call(this);
};

Galv.STURN.Game_Player_moveStraight = Game_Player.prototype.moveStraight;
Game_Player.prototype.moveStraight = function(d) {
	if (this.direction() != d && this._stopCount > 0) {
		this._turnPause = this.isDashing() || this.isMoveRouteForcing() ? 0 : Galv.STURN.delay;
	}
	if (this._turnPause > 0) {
		this.setDirection(d);
		this._turnPause -= 1;
	} else {
		Galv.STURN.Game_Player_moveStraight.call(this,d);
	}
};

Galv.STURN.Game_Player_getOnVehicle = Game_Player.prototype.getOnVehicle;
Game_Player.prototype.getOnVehicle = function() {
	this._turnPause = 0;
	Galv.STURN.Game_Player_getOnVehicle.call(this);
};

Galv.STURN.Game_Player_getOffVehicle = Game_Player.prototype.getOffVehicle;
Game_Player.prototype.getOffVehicle = function() {
	this._turnPause = 0;
	Galv.STURN.Game_Player_getOffVehicle.call(this);
};

})();

// compatibility

if (Imported.SimpleLandVehicle) {
	Game_Player.prototype.forceMoveTo = function(d) {
		this._turnPause = 0;
		this._moveRouteForcing = true;
		this.setThrough(true);
		this.moveStraight(d);
		this.setThrough(false);
		this._moveRouteForcing = false;
	};

};

if (Imported.TH_LockFaceDirection) {
	Game_Player.prototype.isdirectionFixButtonPressed = function() {
		var pressing = Game_CharacterBase.prototype.isdirectionFixButtonPressed.call(this);
		if (pressing) {
			this._turnPause = 0;
			this._stopCount = 0;
		};
		return pressing;
	};
};