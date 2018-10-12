/*:
 * @plugindesc v1.01 Load last saved game after gameover.
 * @author Torqus
 * @help
 * CHANGELOG
 *	1.01 - Now the player can decide if he wants to continue or go to the title with Ok or Cancel keys
 *
 * Load last save after Gameover
 *
 * This plugin is simple enough for anyone to understand, it just modifies 
 * the way the GameOver scene works.
 *
 * Originally when you lose you are sent to the title screen, I don't think
 * that's something you really want for your game, I want my players
 * to keep playing, so I'll save them the rage of reloading their save files.
 *
 * That's what this plugin does, it loads the last saved file by the player,
 * not the file 99 or the most advanced, just the last save made,
 * so they keep playing the game they were playing before the game over.
 * And, if there's no saved game, it will send the player to the title screen 
 * just as before.
 *
 * Also, if you press enter, the save is loaded, but if the Cancel button
 * is pressed, you're sent to the title screen.
 *
 * Don't need to credit, this is a very short plugin that anyone could have made.
 */

Scene_Gameover.prototype.update = function() {
    if (this.isActive() && !this.isBusy() && this.isTriggered()) {
        this.loadgame();
    }
    if (this.isActive() && !this.isBusy() && this.isBackTriggered()) {
        this.gotoTitle();
    }
    Scene_Base.prototype.update.call(this);
};

Scene_Gameover.prototype.isTriggered = function() {
    return Input.isTriggered('ok') || TouchInput.isTriggered();
};
Scene_Gameover.prototype.isBackTriggered = function() {
    return Input.isRepeated('cancel') || TouchInput.isCancelled();
};

Scene_Gameover.prototype.loadgame = function() {
    this.fadeOutAll();
	if(DataManager.isAnySavefileExists()){
		DataManager.loadGame(DataManager.latestSavefileId());
		this.reloadMapIfUpdated();
		$gameSystem.onAfterLoad();
		SceneManager.goto(Scene_Map);
	}
	else{
		SceneManager.goto(Scene_Title);
	}
};

Scene_Gameover.prototype.gotoTitle = function() {
    this.fadeOutAll();
	SceneManager.goto(Scene_Title);
};

Scene_Gameover.prototype.reloadMapIfUpdated = function() {
    $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
    $gamePlayer.requestMapReload();
};
