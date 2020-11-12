/* 
  Copyright 2020. Jefferson "jscher2000" Scher. License: MPL-2.0.
  Icon credit: https://www.nicepng.com/ourpic/u2e6w7i1o0e6a9u2_a-drawing-of-two-people-side-by-side/
  version 0.5 - initial concept
*/

/**** User preferences ****/

// Default starting values
var oPrefs = {
	blnOpenRight: true			// Right side or left side? make this user selectable later
}
// Update oPrefs from storage
browser.storage.local.get("prefs").then((results) => {
	if (results.prefs != undefined){
		if (JSON.stringify(results.prefs) != '{}'){
			var arrSavedPrefs = Object.keys(results.prefs)
			for (var j=0; j<arrSavedPrefs.length; j++){
				oPrefs[arrSavedPrefs[j]] = results.prefs[arrSavedPrefs[j]];
			}
		}
	}
}).catch((err) => {console.log('Error retrieving "prefs" from storage: '+err.message);});

/**** Check/Move new tab ****/

function adjacentize(tab) {
	// If there is no openerTabId then we can't do anything
	if (!tab.openerTabId){
		return;
	}

	// Check the current position and move the tab if needed
	browser.tabs.get(tab.openerTabId).then((openerTab) => {
		if (oPrefs.blnOpenRight){
			if (tab.index !== openerTab.index + 1){
				browser.tabs.move(
					tab.id,
					{ index: openerTab.index + 1 }
				).then((tabAfter) => {
					// noop
				}).catch((err) => {
					console.log('tabs.move snafu: ' + err);
				});
			}
		} else {
			if (tab.index !== openerTab.index - 1){
				browser.tabs.move(
					tab.id,
					{ index: openerTab.index }
				).then((tabAfter) => {
					// noop
				}).catch((err) => {
					console.log('tabs.move snafu: ' + err);
				});
			}
		}
	});
}

browser.tabs.onCreated.addListener(adjacentize);