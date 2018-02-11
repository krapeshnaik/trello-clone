import React, {
    Component
} from 'react';

// Components
import List from './List/List.jsx';

// Actions
import {
    moveTask,
    reOrderTask,
    initTrelloStore,
    updateTrelloStore
} from './tasks.actions.js';

// Component styles
require('./tasks.scss');

/**
 * Represents Tasks container
 * @class
 */
class Tasks extends Component {
    constructor() {
        super();

        // Initial state
        this.state = {
            currentTask: {
                showModal: false,
                listType: 'todo',
                index: null,
                title: '',
                description: '',
                priority: 'normal'
            },
            todo: [],
            progress: [],
            completed: []
        }
    }

    componentDidMount() {
        let savedData = initTrelloStore(val => {
            if (val === null) {
                alert('IDB init failed!');
            } else {
                this.setState({
                    ...this.state,
                    ...val
                });
            }
        });
    }

    render() {
        return (
            <div className="tasks">
                {/* Overlay mask */}
                {
                    this.state.currentTask.showModal &&
                    <div className="mask"
                        onClick={this.toggleCurrentTaskModal}></div>
                }

                {/* New task modal  */}
                {
                    this.state.currentTask.showModal &&
                    (
                        <form action="" className="new-task-modal">
                            <label>Title</label>
                            <input required
                                type="text"
                                name="title"
                                value={this.state.currentTask.title}
                                onChange={e => this.readInput(e, 'title')} />

                            <label>Description</label>
                            <textarea required
                                type="text"
                                name="description"
                                value={this.state.currentTask.description}
                                onChange={e => this.readInput(e, 'description')}>
                            </textarea>

                            <div className="priority">
                                <span>
                                    <input type="radio"
                                        name="priority"
                                        value="normal"
                                        checked={this.state.currentTask.priority === 'normal'}
                                        onChange={e => this.readInput(e, 'priority')} />
                                    Normal
                            </span>
                                <span>
                                    <input type="radio"
                                        name="priority"
                                        value="high"
                                        checked={this.state.currentTask.priority === 'high'}
                                        onChange={e => this.readInput(e, 'priority')} />
                                    High
                            </span>
                                <span>
                                    <input type="radio"
                                        name="priority"
                                        value="critical"
                                        checked={this.state.currentTask.priority === 'critical'}
                                        onChange={e => this.readInput(e, 'priority')} />
                                    Critical
                            </span>
                            </div>

                            <button id="add_task"
                                onClick={() => this.addOrUpdateTask(
                                    this.state.currentTask.listType,
                                    this.state.currentTask.index)}>
                                Save
                            </button>
                        </form>
                    )
                }

                {/* Render lists */}
                <List listType="todo"
                    title="To Do"
                    defaultAction={true}
                    tasks={this.state.todo}
                    toggleCurrentTaskModal={this.toggleCurrentTaskModal}
                    drag={this.drag}
                    dragOver={this.dragOver}
                    dragLeave={this.dragLeave}
                    drop={this.drop}
                    edit={this.editTask}
                    delete={this.deleteTask}
                    reOrder={this.reOrder} />

                <List listType="progress"
                    title="In Progress"
                    tasks={this.state.progress}
                    drag={this.drag}
                    dragOver={this.dragOver}
                    dragLeave={this.dragLeave}
                    drop={this.drop}
                    edit={this.editTask}
                    delete={this.deleteTask}
                    reOrder={this.reOrder} />

                <List listType="completed"
                    title="Completed"
                    tasks={this.state.completed}
                    drag={this.drag}
                    dragOver={this.dragOver}
                    dragLeave={this.dragLeave}
                    drop={this.drop}
                    edit={this.editTask}
                    delete={this.deleteTask}
                    reOrder={this.reOrder} />
            </div>
        );
    }

    /**
     * @function
     * @desc Hids/Show Add/Edit task modal
     * @param none
     * @returns none
     */
    toggleCurrentTaskModal = () => {
        // Update state
        this.setState({
            currentTask: {
                ...this.state.currentTask,
                showModal: !this.state.currentTask.showModal
            }
        });
    }

    /**
     * @function
     * @desc Reads input for Add/Edit task modal
     * @param {Object} e Event
     * @param {String} target Title/Description of the task
     * @returns none
     */
    readInput = (e, target) => {
        this.setState({
            currentTask: {
                ...this.state.currentTask,
                [target]: e.target.value
            }
        }, () => {
            console.log(this.state);
        })
    }

    /**
     * @function
     * @desc Add/Update an existing task
     * @param {String} listType Selected list name
     * @param {Number} index Task identifier in the list
     * @returns none
     */
    addOrUpdateTask = (listType = 'todo', index = null) => {
        let list = this.state[listType];

        if (index === null) {
            // Adding new task
            list.push({
                title: this.state.currentTask.title,
                description: this.state.currentTask.description,
                priority: this.state.currentTask.priority
            });
        } else {
            // Updating a task
            list[index] = {
                title: this.state.currentTask.title,
                description: this.state.currentTask.description,
                priority: this.state.currentTask.priority
            }
        }

        // Update state
        this.setState({
            currentTask: {
                showModal: false,
                title: '',
                description: '',
                priority: 'normal'
            },
            [listType]: list
        }, () => {
            // Update to persistent store
            updateTrelloStore(this.state);
        });
    }

    /**
     * @function
     * @desc Edit an existing task
     * @param {String} listType Selected list name
     * @param {Number} index Task identifier in the list
     * @returns none
     */
    editTask = (listType, index) => {
        let task = this.state[listType][index];

        // Open modal with selected task
        this.setState({
            currentTask: {
                showModal: true,
                listType,
                index,
                title: task.title,
                description: task.description,
                priority: task.priority
            }
        });
    }

    /**
     * @function
     * @desc Delete a task
     * @param {String} listType Selected list name
     * @param {Number} index Task identifier in the list
     * @returns none
     */
    deleteTask = (listType, index) => {
        let list = this.state[listType];

        // Remove particular task from list
        list.splice(index, 1);

        // Update state
        this.setState({
            [listType]: list
        }, () => {
            // Update to persistent store
            updateTrelloStore(this.state);
        });
    }

    /**
     * @function
     * @desc Re-order task in a particular list
     * @param {String} direction Direction of re-order(up/down)
     * @param {String} listType Selected list name
     * @param {Number} index Task identifier in the list
     * @returns none
     */
    reOrder = (direction, listType, index) => {
        let list = reOrderTask(direction, listType, index, this.state);

        // Update state
        this.setState({
            [listType]: list
        }, () => {
            // Update to persistent store
            updateTrelloStore(this.state);
        });
    }

    /**
     * @function
     * @desc Triggered when a task is being dragged
     * @param {Object} event Event object
     * @returns none
     */
    drag = event => {
        event.dataTransfer.setData('text', JSON.stringify({
            ...event.target.dataset
        }));
    }

    /**
     * @function
     * @desc Triggered when a task hovers any list
     * @param {Object} event Event object
     * @returns none
     */
    dragOver = event => {
        event.preventDefault();
        event.target.classList.add('drag-over');
    }

    /**
     * @function
     * @desc Triggered when a task is dropped on a valid target
     * @param {Object} event Event object
     * @returns none
     */
    drop = event => {
        event.preventDefault();
        event.target.classList.remove('drag-over');
        let grabbedTask = JSON.parse(event.dataTransfer.getData('text'));

        let newState = moveTask(grabbedTask.id,
            grabbedTask.type,
            event.target.dataset.type,
            this.state);

        this.setState(newState, () => {
            // Update to persistent store
            updateTrelloStore(this.state);
        });
    }

    /**
     * @function
     * @desc Triggered when a task leaves a valid target
     * @param {Object} event Event object
     * @returns none
     */
    dragLeave = event => {
        event.preventDefault();
        event.target.classList.remove('drag-over');
    }
}

export default Tasks;