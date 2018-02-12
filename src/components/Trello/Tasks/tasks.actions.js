import idbKeyval from 'idb-keyval';

/**
 * @function
 * @desc Move a task across list
 * @param {Number} taskId Task identifier in a list
 * @param {String} currentList Current list of the task
 * @param {String} newList New list of the task
 * @param {Object} state Current state
 * @returns {Object} new state
 */
export const moveTask = (taskId, currentList, newList, state) => {
    // Dropped a task away from a valid target
    if (!newList)
        return;

    // Remove from current list
    let poppedState = state[currentList].splice(taskId, 1);

    // Move to new list
    state[newList].push(poppedState[0]);

    // Updated state
    return state;
};

/**
 * @function
 * @desc Re-order a task in a list
 * @param {String} direction Direction of re-order(up/down)
 * @param {String} listType Selected list name
 * @param {Number} index Task identifier in the list
 * @param {Object} state Current state
 * @returns {Object} new state
 */
export const reOrderTask = (direction, listType, index, state) => {
    // Current list
    let list = state[listType];

    if (direction === 'up') {
        // Check index
        if (index > 0) {
            // Swap current and previous task
            let curr = list[index],
                prev = list[index - 1];

            list[index] = prev;
            list[index - 1] = curr;
        }
    } else if (direction === 'down') {
        // Check index
        if (index < list.length - 1) {
            // Swap current and next task
            let curr = list[index],
                next = list[index + 1];

            list[index] = next;
            list[index + 1] = curr;
        }
    }

    return list;
};

/**
 * @function
 * @desc Initialise a persistent store
 * @param {Function} callback Callback function
 * @returns none
 */
export const initTrelloStore = callback => {
    // Check for already existing data
    idbKeyval
        .get('trello_clone_store')
        .then(val => {
            if (val === undefined) {
                // No data found. Set defaults
                idbKeyval
                    .set('trello_clone_store', {
                        todo: [],
                        progress: [],
                        completed: []
                    })
                    .then(val => {
                        callback(val);
                    })
                    .catch(() => {
                        callback(null);
                    })
            } else {
                // Return existing data
                callback(val);
            }
        });
}

/**
 * @function
 * @desc Update the persistent store
 * @param {Object} data Data to be updated
 * @returns none
 */
export const updateTrelloStore = data => {
    idbKeyval
        .set('trello_clone_store', {
            ...data
        })
        .then(() => {
            console.log('Data updated');
        })
        .catch(err => {
            alert('update failed');
        })
}

/**
 * @function
 * @desc Delete everything
 * @param none
 * @returns {Boolean} flag
 */
export const clearBoard = () => {
    var input = confirm("Are you sure you want to delete all tasks?");

    if (input) {
        // Clear idb store
        idbKeyval.clear();
        return true;
    }

    return false;
}