/*
Todo
- 
- 
*/

var attack_mode=false

load_code("partyInteractions");

setTimeout(() => {
    follow_leader("Yoshihara", 120);
	request_party_invite_on_load()
}, 1000);

setInterval(function(){

	use_hp_or_mp();
	loot();

	if(!attack_mode || character.rip || is_moving(character)) return;
	// Get the current target (which might have been set by the on_cm handler)
	let target = get_targeted_monster();

	// If no target is currently selected (manually or by CM), wait.
	if (!target) {
		set_message("Awaiting target from leader");
		return; // Don't try to move or attack without a target
	}

	// If we have a target:
	if (!is_in_range(target)) {
		// Move towards the target (same logic as before)
		move(
			character.x + (target.x - character.x) / 2,
			character.y + (target.y - character.y) / 2
		);
	} else if (can_attack(target)) {
		// Double-check the target is still valid before attacking
		let current_target_entity = parent.entities[target.id]; // Check the entity map
		if (current_target_entity && !current_target_entity.dead && current_target_entity.visible) {
			set_message("Attacking target");
			attack(target);
		} else {
			// Target became invalid (died, disappeared, etc.)
			change_target(null); // Clear the invalid target
			set_message("Target invalid/gone");
		}
	}
},1000/4); // Loops every 1/4 seconds.

// Learn Javascript: https://www.codecademy.com/learn/introduction-to-javascript
// Write your own CODE: https://github.com/kaansoral/adventureland
