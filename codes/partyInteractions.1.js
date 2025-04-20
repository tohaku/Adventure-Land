const party_members = ["Tohaku","Alextra"];
const party_leader = "Yoshihara";

function init_team(){
    
}

// Function for followers to request an invite on load
function request_party_invite_on_load() {
    // Check if the current character is NOT the leader
    if (character.name !== party_leader) {
        log(`Requesting party invite from ${party_leader}`);
        // Send a custom message (CM) to the leader
        send_cm(party_leader, { type: "invite_request" });
    }
}

//follow the leader
let isFollowing = false;

function follow_leader(leader_name, follow_distance = 120, follow_interval = 250) {
    if(character.name!=party_leader && !isFollowing){
        setInterval(() => {
            const target2 = parent.entities[leader_name];

            if (!target2) return;

            const dx = target2.x - character.x;
            const dy = target2.y - character.y;
            const distance = Math.hypot(dx, dy);

            if (distance > follow_distance && !character.moving) {
                const angle = Math.atan2(dy, dx);
                const buffer = follow_distance - 20 + Math.random() * 40;
                const moveX = target2.x - Math.cos(angle) * buffer;
                const moveY = target2.y - Math.sin(angle) * buffer;
                move(moveX, moveY);
            }
        }, follow_interval);
    }
}

//used by followers to accept party invite
function on_party_invite(name) {
	if (character.name != party_leader && name === party_leader) {
		accept_party_invite(name);
		log(`Party invite accepted from ${name}`);
	}else log(`Party invite not accepted from ${name}`);
}

// Used by the leader to announce their current target to party members
function announce_target() {
    // Only the leader should announce targets
    if (character.name !== party_leader) {
        return;
    }

    const current_target = get_targeted_monster();

    if (current_target) {
        // Send the target ID to each online party member
        log(`Announcing target: ${current_target.mtype} (ID: ${current_target.id})`);
        for (const member_name of party_members) {
            // Check if the member is currently loaded/visible by the leader
            if (parent.entities[member_name]) {
                 send_cm(member_name, { type: "new_target", target_id: current_target.id });
            }
        }
    }
    // Optional: You could add an 'else' here to send a "no_target" message if needed,
    // but it might create unnecessary message traffic.
}
function on_cm(name, data) {
    //invite_request used by Yoshihara to see request and send invite
    if (data && data.type === "invite_request" && party_members.includes(name)) {
        // Check if the requester is NOT already in the current party
        // parent.party_list holds the names of characters currently in your party
        if (!parent.party_list || !parent.party_list.includes(name)) {
            log(`Received party invite request from ${name}. Sending invite.`);
            send_party_invite(name);
        } else {
            log(`Received party invite request from ${name}, but they are already in the party.`);
        }
    }
    else if (data && data.type === "new_target" && name === party_leader && character.name !== party_leader) {
        // This code runs on the follower (Alextra, Tohaku)
        const leader_target_id = data.target_id;
        const current_target = get_targeted_monster(); // Follower's current target

        // Avoid switching if already targeting the announced monster
        if (current_target && current_target.id === leader_target_id) {
            return;
        }

        // Find the monster entity announced by the leader using its ID
        // Using parent.entities is generally efficient for loaded entities
        const monster_to_target = parent.entities[leader_target_id];

        // Check if the entity exists, is a monster, and is alive
        if (monster_to_target && monster_to_target.type === "monster" && !monster_to_target.dead) {
             log(`Received target ${monster_to_target.mtype} (ID: ${leader_target_id}) from leader ${name}. Switching target.`);
             change_target(monster_to_target); // Switch follower's target
        } else {
            log(`Received target ID ${leader_target_id} from leader, but monster not found or invalid.`);
            // Optional: If the leader announces an invalid target, maybe clear the follower's current target?
            // if (current_target) change_target(null);
        }
    }
    // You can add more 'else if' blocks here to handle other types of CMs later
}