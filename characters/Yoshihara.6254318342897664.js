
/*
Todo

*/

var attack_mode=false

load_code("partyInteractions");



setInterval(function(){

	use_hp_or_mp();
	loot();

	if(!attack_mode || character.rip || is_moving(character)) return;

	var target=get_targeted_monster();
	if(!target)
	{
		target=get_nearest_monster({min_xp:100,max_att:120});
		
		if(target) change_target(target);
		//added by me to tell followers current target
		announce_target();
	}else
		{
			set_message("No Monsters");
			return;
		}
	
	
	// --- Action Logic (Requires a valid target) ---
    // Double-check target validity after potential selection above
    if (target) {
        // Check if target is still valid (exists, alive, visible)
        let current_target_entity = parent.entities[target.id];
        if (!current_target_entity || current_target_entity.dead || !current_target_entity.visible) {
             // Target became invalid
             change_target(null); // Clear the invalid target
             set_message("Target invalid/gone");
             return; // Exit this interval
        }


        if (!is_in_range(target)) {
            // Move towards the target
            move(
                character.x + (target.x - character.x) / 2,
                character.y + (target.y - character.y) / 2
            );
            // Set message while moving
            set_message(`Moving to ${target.mtype}`);
        } else if (can_attack(target)) {
            set_message(`Attacking ${target.mtype}`);
			announce_target();
            attack(target);
        }
    } else {
         // This case should ideally not be reached if logic above is sound,
         // but acts as a fallback.
         set_message("Waiting...");
    }

}, 1000 / 4); // Loops every 1/4 seconds.

// Learn Javascript: https://www.codecademy.com/learn/introduction-to-javascript
// Write your own CODE: https://github.com/kaansoral/adventureland
